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
