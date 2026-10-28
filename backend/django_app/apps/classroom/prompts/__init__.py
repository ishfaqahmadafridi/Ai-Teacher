"""
apps/classroom/prompts/__init__.py

Barrel export for the Classroom prompts package.
"""
from .classroom_prompts import SYSTEM_PROMPT, RAG_CONTEXT_SUFFIX

__all__ = [
    'SYSTEM_PROMPT',
    'RAG_CONTEXT_SUFFIX',
]

from .note_translation import NOTE_TRANSLATION_PROMPT
from .scheduled_lesson_prompt import SCHEDULED_LESSON_PROMPT
from .lesson_evaluation import LESSON_EVALUATION_PROMPT

__all__ += ['SCHEDULED_LESSON_PROMPT', 'LESSON_EVALUATION_PROMPT']
