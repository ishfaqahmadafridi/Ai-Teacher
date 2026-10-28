"""Bounded evaluation with a durable lease and cached results."""
import json
from datetime import timedelta
from django.db import models, transaction
from django.utils import timezone
from rest_framework.exceptions import APIException
from apps.classroom.models.lesson_attempt import LessonAttempt, LessonProgress
from apps.classroom.services.llm_service import get_llm, extract_json
from apps.classroom.prompts.lesson_evaluation import LESSON_EVALUATION_PROMPT
from apps.classroom.serializers.lesson_serializers import LessonEvaluationSerializer
from apps.classroom.constants.lesson import EVALUATION_LEASE_SECONDS, EVALUATION_MODEL, EVALUATION_MAX_TOKENS


class EvaluationUnavailable(APIException):
    status_code = 503
    default_detail = 'Your answer is saved, but feedback is unavailable. Retry shortly.'


class EvaluationProcessing(APIException):
    status_code = 409
    default_detail = 'Feedback is already processing. Retry shortly.'


def evaluate_attempt(attempt):
    with transaction.atomic():
        item = LessonAttempt.objects.select_for_update().get(pk=attempt.pk)
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
        chunk = item.note.answer['chunks'][item.section_index]
        payload = {'question': item.question, 'answer': item.answer,
                   'expected_concepts': chunk['expected_concepts'], 'language': item.note.answer['language']}
        result = model.bind(max_output_tokens=EVALUATION_MAX_TOKENS).invoke([
            SystemMessage(content=LESSON_EVALUATION_PROMPT), HumanMessage(content=json.dumps(payload))])
        serializer = LessonEvaluationSerializer(data=extract_json(result.text))
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            updated = LessonAttempt.objects.filter(pk=item.pk, evaluating_since=lease).update(
                evaluation=dict(serializer.validated_data), evaluating_since=None)
            if not updated:
                raise EvaluationProcessing()
            if serializer.validated_data['next_action'] == 'continue':
                LessonProgress.objects.filter(note=item.note, section_index=item.section_index, waiting=True).update(
                    section_index=item.section_index + 1, waiting=False, revision=models.F('revision') + 1)
        item.refresh_from_db()
        return item
    except EvaluationProcessing:
        raise
    except Exception:
        LessonAttempt.objects.filter(pk=item.pk, evaluating_since=lease).update(evaluating_since=None)
        raise EvaluationUnavailable() from None
