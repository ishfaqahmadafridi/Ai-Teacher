"""
apps/classroom/prompts/__init__.py

Barrel export for the Classroom prompts package.
"""
from .classroom_prompts import SYSTEM_PROMPT, RAG_CONTEXT_SUFFIX

__all__ = [
    'SYSTEM_PROMPT',
    'RAG_CONTEXT_SUFFIX',
]
