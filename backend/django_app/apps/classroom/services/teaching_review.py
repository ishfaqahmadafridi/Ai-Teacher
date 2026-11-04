"""Review lesson narration against grounded pedagogical evidence checks."""
import json
from langchain_core.messages import HumanMessage, SystemMessage
from apps.classroom.constants.teaching_quality import (
    QUALITY_CHECKS, QUALITY_REVIEW_TOKENS, QUALITY_EVIDENCE_STEPS,
)
from apps.classroom.prompts.teaching_quality_prompt import TEACHING_REVIEW_PROMPT
from apps.classroom.serializers.teaching_quality_serializers import TeachingReviewSerializer
from apps.classroom.services.llm_service import extract_json
from apps.classroom.services.prompt_budget import validate_model_context


def review_teaching_quality(llm, question, history, context, answer, *, usage_ledger=None):
    messages, output_tokens = validate_model_context(llm, [
        SystemMessage(content=TEACHING_REVIEW_PROMPT.format(checks=', '.join(QUALITY_CHECKS))),
        HumanMessage(content=json.dumps({'question': question, 'recent_history': history[-2:],
                                        'student': context.get('student'),
                                        'curriculum': context.get('scheduled_lesson'), 'answer': answer}, ensure_ascii=False)),
    ], requested_output_tokens=QUALITY_REVIEW_TOKENS)
    response = llm.invoke(messages, max_output_tokens=output_tokens)
    review_tokens = (response.usage_metadata or {}).get('total_tokens', 0)
    if usage_ledger is not None:
        usage_ledger['review_tokens'] += review_tokens
    serializer = TeachingReviewSerializer(data=extract_json(response.text))
    serializer.is_valid(raise_exception=True)
    findings = serializer.validated_data['findings']
    issues = []
    for finding in findings:
        if not finding['passed']:
            issues.append(finding['check'] + ': ' + finding['reason'])
            continue
        index = finding.get('section_index')
        quote = finding.get('quote', '').strip()
        if index is None or index >= len(answer['chunks']) or not quote or quote not in answer['chunks'][index]['speak']:
            issues.append(finding['check'] + ': Review evidence must quote actual narration.')
            continue
        expected_step = QUALITY_EVIDENCE_STEPS.get(finding['check'])
        if answer.get('lesson_mode') == 'lesson' and expected_step and (answer['chunks'][index].get('teaching_step') != expected_step or (expected_step == 'practice' and not answer['chunks'][index].get('question'))):
            issues.append(finding['check'] + ': Evidence must come from the corresponding teaching step.')
    return issues, review_tokens
