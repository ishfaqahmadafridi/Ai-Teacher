"""
fastapi_app/app/langchain/__init__.py
LangChain model client wrappers and system prompts.
"""
from .llm_client import get_langchain_llm
from .prompts import SYSTEM_PROMPT, RAG_CONTEXT_TEMPLATE

__all__ = [
    'get_langchain_llm',
    'SYSTEM_PROMPT',
    'RAG_CONTEXT_TEMPLATE',
]
