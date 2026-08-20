"""
Teacher RAG package.
Exposes vector search, background initialization, and collection access.
"""
from .searcher import search
from .store import start_background_init, get_collection, is_ready

__all__ = ['search', 'start_background_init', 'get_collection', 'is_ready']
