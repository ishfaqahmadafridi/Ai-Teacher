"""
apps/classroom/prompts/__init__.py

Barrel export for the Classroom prompts package.
"""
from .classroom_prompts import SYSTEM_PROMPT
from .conceptual_visual_prompt import (
    CONCEPTUAL_VISUAL_PROMPT, ASSEMBLY_VISUAL_PROMPT, MOLECULE_VISUAL_PROMPT, ANATOMY_VISUAL_PROMPT,
)

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

__all__ += ['ASSEMBLY_VISUAL_PROMPT', 'MOLECULE_VISUAL_PROMPT', 'ANATOMY_VISUAL_PROMPT']

from .teaching_quality_prompt import TEACHING_DEPTH_PROMPT, TEACHING_REVIEW_PROMPT

__all__ += ['TEACHING_DEPTH_PROMPT', 'TEACHING_REVIEW_PROMPT']

from .doubt_teacher_prompt import DOUBT_TEACHER_PROMPT, DOUBT_LEAK_RETRY_NOTE
__all__ += ['DOUBT_TEACHER_PROMPT', 'DOUBT_LEAK_RETRY_NOTE']

from .scheduled_lesson_prompt import PREVIOUS_CLASSES_PROMPT
__all__ += ['PREVIOUS_CLASSES_PROMPT']

from .subject_teaching_prompt import SUBJECT_RULES_HEADER, SUBJECT_TEACHING_RULES
__all__ += ['SUBJECT_RULES_HEADER', 'SUBJECT_TEACHING_RULES']
