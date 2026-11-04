"""
apps/classroom/services/__init__.py
"""
from .session_service import get_session, save_session, clear_session, append_session
from .llm_service import get_llm, extract_json, fallback_chunks

__all__ = [
    'get_session',
    'save_session',
    'clear_session',
    'append_session',
    'get_llm',
    'extract_json',
    'fallback_chunks',
]

from .lecture_notes import save_lecture_note, get_lecture_note, list_lecture_notes, note_content, note_response
from .note_translation import translate_note, saved_note_content
from .note_document import create_note_document
from .note_figures import save_note_figure, note_figures

from .lesson_audio import lesson_audio
from .lesson_answers import submit_lesson_answer
from .lesson_evaluation import evaluate_attempt

__all__ += ['submit_lesson_answer', 'evaluate_attempt']

from .quota_fallback import QuotaFallbackLLM, is_quota_error
__all__ += ['QuotaFallbackLLM', 'is_quota_error']

from .teaching_messages import teaching_messages
from .lesson_evaluation import evaluate_owned_attempt
__all__ += ['teaching_messages', 'evaluate_owned_attempt']

from .lesson_discussion import answer_discussion
__all__ += ['answer_discussion']

from .lesson_hand import lesson_hand

from .prompt_budget import budget_teaching_messages, model_prompt_limits
__all__ += ['budget_teaching_messages', 'model_prompt_limits']

from .teaching_quality import generate_reviewed_teaching, review_teaching_quality, validate_teaching_structure

__all__ += ['generate_reviewed_teaching', 'review_teaching_quality', 'validate_teaching_structure']
