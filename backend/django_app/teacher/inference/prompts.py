"""
teacher/inference/prompts.py

Compatibility re-export shim for system prompts.
Canonical location is `teacher/prompts/`.
"""
from teacher.prompts import SYSTEM_PROMPT, RAG_CONTEXT_SUFFIX

__all__ = ['SYSTEM_PROMPT', 'RAG_CONTEXT_SUFFIX']
