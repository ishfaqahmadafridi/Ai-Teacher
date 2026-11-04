"""Persist and answer bounded concept questions without changing the saved lesson."""
import json
from datetime import timedelta
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import APIException, ValidationError
from apps.classroom.models.lesson_attempt import LessonAttempt, LessonProgress
from apps.classroom.models.lecture_notes import LectureNote
from apps.classroom.services.student_teaching_context import student_teaching_context
from apps.classroom.services.lecture_notes import get_lecture_note
from apps.classroom.services.llm_service import get_llm, extract_json
from apps.classroom.services.lesson_provider_admission import provider_delay
from apps.classroom.serializers.lesson_serializers import LessonDiscussionReplySerializer
from apps.classroom.prompts.discussion_prompt import DISCUSSION_REPLY_PROMPT
from apps.classroom.constants.lesson import DISCUSSION_WINDOW_SECONDS, DISCUSSION_MAX_TOKENS, EVALUATION_LEASE_SECONDS


class DiscussionUnavailable(APIException):
    status_code = 503
    default_detail = 'Your question is saved, but the teacher reply is unavailable. Please retry while the question period is open.'


class DiscussionClosed(APIException):
    status_code = 409
    default_detail = 'This concept question period has closed.'


def answer_discussion(user, note_id, request_id, section_index, question):
    with transaction.atomic():
        note = get_lecture_note(user, note_id)
        LectureNote.objects.select_for_update().get(pk=note.pk)
        if section_index >= len(note.answer['chunks']):
            raise ValidationError('Unknown lesson section.')
        chunk = note.answer['chunks'][section_index]
        if not chunk.get('discussion_prompt'):
            raise ValidationError('This section is not a concept question period.')
        attempt = LessonAttempt.objects.filter(note=note, request_id=request_id).first()
        if attempt and (attempt.section_index != section_index or attempt.answer != question):
            raise ValidationError('This request ID belongs to a different question.')
        if attempt and attempt.evaluation:
            return {'id': attempt.pk, 'reply': attempt.evaluation['reply']}
        now = timezone.now()
        progress = LessonProgress.objects.filter(note=note, section_index=section_index, waiting=True).first()
        if progress is None or now >= progress.updated_at + timedelta(seconds=DISCUSSION_WINDOW_SECONDS):
            raise DiscussionClosed()
        if attempt and attempt.evaluating_since and attempt.evaluating_since > now - timedelta(seconds=EVALUATION_LEASE_SECONDS):
            raise DiscussionClosed('The teacher is already preparing this reply.')
        active = LessonAttempt.objects.filter(note=note, section_index=section_index, evaluating_since__gt=now - timedelta(seconds=EVALUATION_LEASE_SECONDS))
        if active.exclude(pk=attempt.pk if attempt else None).exists():
            raise DiscussionClosed('The teacher is already answering another question.')
        if attempt is None:
            attempt = LessonAttempt.objects.create(note=note, request_id=request_id, section_index=section_index,
                question=chunk['discussion_prompt'], answer=question)
        attempt.evaluating_since = now
        attempt.save(update_fields=['evaluating_since'])
    try:
        from langchain_core.messages import SystemMessage, HumanMessage
        if provider_delay():
            raise DiscussionUnavailable()
        model = get_llm(temperature=0.3, max_retries=0)
        if model is None:
            raise DiscussionUnavailable()
        context = {'student_context': student_teaching_context(user), 'topic': note.answer['topic'], 'language': note.answer['language'],
                   'concept': note.answer['chunks'][max(0, section_index - 2):section_index], 'question': question}
        response = model.bind(max_output_tokens=DISCUSSION_MAX_TOKENS).invoke([
            SystemMessage(content=DISCUSSION_REPLY_PROMPT), HumanMessage(content=json.dumps(context))])
        serializer = LessonDiscussionReplySerializer(data={'id': attempt.pk, **extract_json(response.text)})
        serializer.is_valid(raise_exception=True)
        reply = serializer.validated_data['reply']
        if not LessonAttempt.objects.filter(pk=attempt.pk, evaluating_since=now).update(
            evaluation={'reply': reply}, evaluating_since=None):
            raise DiscussionClosed('This reply was superseded.')
        return {'id': attempt.pk, 'reply': reply}
    except DiscussionClosed:
        raise
    except Exception:
        LessonAttempt.objects.filter(pk=attempt.pk, evaluating_since=now).update(evaluating_since=None)
        raise DiscussionUnavailable() from None
