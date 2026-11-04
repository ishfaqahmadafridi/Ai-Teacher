"""
apps/classroom/prompts/__init__.py

Barrel export for the Classroom prompts package.
"""
from .classroom_prompts import SYSTEM_PROMPT
from .conceptual_visual_prompt import CONCEPTUAL_VISUAL_PROMPT, ASSEMBLY_VISUAL_PROMPT, MOLECULE_VISUAL_PROMPT

__all__ = [
    'SYSTEM_PROMPT',
    'CONCEPTUAL_VISUAL_PROMPT',
]

from .note_translation import NOTE_TRANSLATION_PROMPT
from .scheduled_lesson_prompt import SCHEDULED_LESSON_PROMPT
from .lesson_evaluation import LESSON_EVALUATION_PROMPT

__all__ += ['SCHEDULED_LESSON_PROMPT', 'LESSON_EVALUATION_PROMPT']


from .discussion_prompt import DISCUSSION_REPLY_PROMPT
__all__ += ['DISCUSSION_REPLY_PROMPT']

__all__ += ['ASSEMBLY_VISUAL_PROMPT', 'MOLECULE_VISUAL_PROMPT']
