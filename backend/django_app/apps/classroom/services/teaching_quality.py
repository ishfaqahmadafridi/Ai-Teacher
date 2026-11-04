"""Orchestrate validated teaching generation and one bounded repair attempt."""
import logging
from rest_framework.exceptions import ValidationError
from apps.classroom.constants.teaching_quality import (
    QUALITY_CHECKS, QUALITY_ATTEMPTS, QUALITY_REPAIR_FEEDBACK_LENGTH,
)
from apps.classroom.serializers.answer_serializers import GeneratedAnswerSerializer
from apps.classroom.services.llm_service import extract_json
from apps.classroom.services.prompt_budget import budget_teaching_messages, PromptBudgetExceeded
from apps.classroom.services.teaching_structure import TeachingQualityError, validate_teaching_structure
from apps.classroom.services.teaching_review import review_teaching_quality
from apps.classroom.utilities.teaching_metadata import normalize_teaching_metadata
from apps.classroom.utilities.serializer_data import validated_mapping


logger = logging.getLogger(__name__)


def generate_reviewed_teaching(llm, question, history, context, context_limit, output_tokens,
                               metadata, *, curriculum=None, require_full_coverage=False):
    total_tokens = 0
    usage_ledger = {'review_tokens': 0}
    feedback = None
    for attempt in range(QUALITY_ATTEMPTS):
        inputs = {**context, **({'quality_feedback': feedback} if feedback else {})}
        messages, budget = budget_teaching_messages(question, history, inputs,
                                                    context_limit=context_limit, output_tokens=output_tokens)
        metadata['prompt_budget'] = budget
        logger.info('Teaching context attempt=%s estimated_input=%s cap=%s output=%s dropped_history=%s trimmed_references=%s',
                    attempt + 1, budget['estimated_input_tokens'], context_limit, output_tokens,
                    budget['history_messages_dropped'], budget['references_trimmed'])
        response = llm.invoke(messages, max_output_tokens=output_tokens)
        usage = response.usage_metadata or {}
        total_tokens += usage.get('total_tokens', 0)
        metadata['teaching_quality'] = {'attempts': attempt + 1, 'passed': False, 'tokens_used': total_tokens + usage_ledger['review_tokens']}
        try:
            serializer = GeneratedAnswerSerializer(data=extract_json(response.text))
            serializer.is_valid(raise_exception=True)
            answer = normalize_teaching_metadata(validated_mapping(serializer.validated_data))
            validate_teaching_structure(answer, curriculum, require_full_coverage)
            issues, _ = review_teaching_quality(llm, question, history[budget['history_messages_dropped']:], inputs, answer, usage_ledger=usage_ledger)
            if issues:
                raise TeachingQualityError('\n'.join(issues))
            metadata['teaching_quality'].update(passed=True, tokens_used=total_tokens + usage_ledger['review_tokens'],
                                                checks=list(QUALITY_CHECKS))
            return answer, response, total_tokens + usage_ledger['review_tokens']
        except PromptBudgetExceeded:
            raise
        except (ValidationError, ValueError) as error:
            # Only bounded diagnostic data is added to the next human reference context.
            # No failed draft is saved as conversation history or appended as a lesson.
            feedback = str(error)[:QUALITY_REPAIR_FEEDBACK_LENGTH]
    metadata['teaching_quality']['tokens_used'] = total_tokens + usage_ledger['review_tokens']
    raise TeachingQualityError('Teaching response failed structural/content review after the bounded repair attempt.')
