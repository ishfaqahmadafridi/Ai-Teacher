"""
apps/classroom/services/lesson_evaluation.py

Grade a response to an understanding check, with a durable lease and cached results.

WHY THE GRADER NEVER WRITES A DOUBT REPLY:
    The grader holds the answer key. When it classifies a response as a student question,
    its feedback is discarded and lesson_doubt.teach_pending_doubt writes the reply without
    the key (least privilege). A doubt that cannot be answered safely leaves the check pending.
"""
import json
from datetime import timedelta
from django.db import models, transaction
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import APIException, ValidationError
from apps.classroom.models.lesson_attempt import LessonAttempt, LessonProgress
from apps.classroom.services.llm_service import get_llm, extract_json
from apps.classroom.prompts.lesson_evaluation import LESSON_EVALUATION_PROMPT
from apps.classroom.serializers.lesson_serializers import LessonEvaluationSerializer
from apps.classroom.constants.lesson import (
    EVALUATION_LEASE_SECONDS, EVALUATION_MODEL, EVALUATION_MAX_TOKENS, DOUBT_OUTCOME,
)
from apps.classroom.services.lesson_doubt import lesson_context_before, teach_pending_doubt


class EvaluationUnavailable(APIException):
    status_code = 503
    default_detail = 'Your answer is saved, but feedback is unavailable. Retry shortly.'


class EvaluationProcessing(APIException):
    status_code = 409
    default_detail = 'Feedback is already processing. Retry shortly.'


def build_evaluation_payload(attempt):
    """Grader input: the answer key plus bounded lesson context to judge intent and the attempt.

    The grader's feedback is never shown for a doubt; lesson_doubt.py writes that reply
    without the answer key.
    """
    lesson = attempt.note.answer
    chunks = lesson['chunks']
    return {'topic': lesson.get('topic', ''), 'language': lesson['language'],
            'lesson_context': lesson_context_before(chunks, attempt.section_index),
            'question': attempt.question, 'answer': attempt.answer,
            'expected_concepts': chunks[attempt.section_index]['expected_concepts']}


def evaluation_with_safe_feedback(attempt, evaluation):
    """Replace grader feedback for a doubt with a reply written without the answer key."""
    if evaluation['outcome'] != DOUBT_OUTCOME:
        return evaluation
    return {**evaluation, 'feedback': teach_pending_doubt(attempt)}


def evaluate_owned_attempt(user, note_id, attempt_id):
    attempt = get_object_or_404(LessonAttempt, pk=attempt_id, note_id=note_id, note__user=user)
    return evaluate_attempt(attempt)


def evaluate_attempt(attempt):
    with transaction.atomic():
        item = LessonAttempt.objects.select_for_update().get(pk=attempt.pk)
        if not item.note.answer['chunks'][item.section_index].get('question'):
            raise ValidationError('This response is not a graded understanding check.')
        if item.evaluation:
            return item
        lease = timezone.now()
        if item.evaluating_since and item.evaluating_since > lease - timedelta(seconds=EVALUATION_LEASE_SECONDS):
            raise EvaluationProcessing()
        item.evaluating_since = lease
        item.save(update_fields=['evaluating_since'])
    try:
        from langchain_core.messages import SystemMessage, HumanMessage
        model = get_llm(temperature=0.1, model=EVALUATION_MODEL, max_retries=0)
        if model is None:
            raise EvaluationUnavailable()
        payload = build_evaluation_payload(item)
        result = model.bind(max_output_tokens=EVALUATION_MAX_TOKENS).invoke([
            SystemMessage(content=LESSON_EVALUATION_PROMPT), HumanMessage(content=json.dumps(payload))])
        serializer = LessonEvaluationSerializer(data=extract_json(result.text))
        serializer.is_valid(raise_exception=True)
        evaluation = evaluation_with_safe_feedback(item, dict(serializer.validated_data))
        with transaction.atomic():
            updated = LessonAttempt.objects.filter(pk=item.pk, evaluating_since=lease).update(
                evaluation=evaluation, evaluating_since=None)
            if not updated:
                raise EvaluationProcessing()
            if evaluation['next_action'] == 'continue':
                LessonProgress.objects.filter(note=item.note, section_index=item.section_index, waiting=True).update(
                    section_index=item.section_index + 1, waiting=False, revision=models.F('revision') + 1)
        item.refresh_from_db()
        return item
    except EvaluationProcessing:
        raise
    except Exception:
        LessonAttempt.objects.filter(pk=item.pk, evaluating_since=lease).update(evaluating_since=None)
        raise EvaluationUnavailable() from None
