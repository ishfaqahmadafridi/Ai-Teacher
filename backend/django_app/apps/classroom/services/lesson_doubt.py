"""
apps/classroom/services/lesson_doubt.py

Explain a student's doubt asked while an understanding check is pending, without the answer key.

WHY A SEPARATE SERVICE:
    The grader (lesson_evaluation.py) must see expected concepts to grade. If the same call also
    writes the doubt reply, the answer key can leak into it. Least privilege by construction:
    build_doubt_payload has no access path to expected concepts, and this service owns the only
    text a student sees for a doubt.

DESIGN DECISIONS:
    - Main model for teaching quality; the small grader model only classifies and grades.
    - The answer key is used afterwards by deterministic code (reveals_expected_answer) to reject
      a reply that still gives the check away. One retry, then fail closed: an unavailable reply
      is better than a leaked answer, and the check stays pending.
"""
import json
from langchain_core.messages import HumanMessage, SystemMessage
from apps.classroom.constants.lesson import (
    DOUBT_LEAK_ATTEMPTS, DOUBT_MAX_TOKENS, DOUBT_TEMPERATURE,
    EVALUATION_CONTEXT_SECTIONS, EVALUATION_CONTEXT_TEXT_MAX_LENGTH,
)
from apps.classroom.prompts.doubt_teacher_prompt import DOUBT_LEAK_RETRY_NOTE, DOUBT_TEACHER_PROMPT
from apps.classroom.serializers.lesson_serializers import DoubtReplySerializer
from apps.classroom.services.llm_service import extract_json, get_llm
from apps.classroom.services.student_teaching_context import student_teaching_context
from apps.classroom.utilities.answer_leak import reveals_expected_answer
from apps.classroom.utilities.lesson_context import spoken_sections
from apps.classroom.utilities.spoken_text import speakable


class DoubtReplyUnavailable(RuntimeError):
    """No safe doubt reply could be produced; the caller keeps the check pending."""


def lesson_context_before(chunks, section_index):
    """Spoken text of the recent sections only: no questions' answer keys, visuals or metadata."""
    return spoken_sections(chunks, section_index - EVALUATION_CONTEXT_SECTIONS + 1, section_index + 1,
                           EVALUATION_CONTEXT_TEXT_MAX_LENGTH)


def build_doubt_payload(attempt):
    """Everything the doubt teacher needs and nothing more (never expected concepts or identity)."""
    lesson = attempt.note.answer
    return {
        'student_context': student_teaching_context(attempt.note.user),
        'topic': lesson.get('topic', ''),
        'language': lesson['language'],
        'lesson_context': lesson_context_before(lesson['chunks'], attempt.section_index),
        'pending_check': attempt.question,
        'student_doubt': attempt.answer,
    }


def teach_pending_doubt(attempt):
    """Return a safe spoken reply to the doubt, or raise DoubtReplyUnavailable."""
    model = get_llm(temperature=DOUBT_TEMPERATURE, max_retries=0)
    if model is None:
        raise DoubtReplyUnavailable('Teaching model unavailable.')
    expected = attempt.note.answer['chunks'][attempt.section_index].get('expected_concepts', [])
    messages = [SystemMessage(content=DOUBT_TEACHER_PROMPT),
                HumanMessage(content=json.dumps(build_doubt_payload(attempt)))]
    for _ in range(DOUBT_LEAK_ATTEMPTS):
        response = model.bind(max_output_tokens=DOUBT_MAX_TOKENS).invoke(messages)
        serializer = DoubtReplySerializer(data=extract_json(response.text))
        serializer.is_valid(raise_exception=True)
        reply = speakable(serializer.validated_data['reply'])
        if not reveals_expected_answer(reply, expected, attempt.question):
            return reply
        messages = [messages[0], HumanMessage(content=f'{messages[1].content}\n\n{DOUBT_LEAK_RETRY_NOTE}')]
    raise DoubtReplyUnavailable('Every reply revealed the pending answer.')
