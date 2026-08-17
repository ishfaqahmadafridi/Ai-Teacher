"""
teacher/prompts/__init__.py

Barrel export for the prompts configuration package.
"""
from .teacher_prompts import SYSTEM_PROMPT, RAG_CONTEXT_SUFFIX

__all__ = [
    'SYSTEM_PROMPT',
    'RAG_CONTEXT_SUFFIX',
]
