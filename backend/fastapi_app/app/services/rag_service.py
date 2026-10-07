"""Async retrieval using the same FAISS collection and ONNX model as Django."""
import asyncio
import logging
import sys
from pathlib import Path

logger = logging.getLogger(__name__)
_DJANGO_ROOT = Path(__file__).resolve().parents[3] / "django_app"
for root in (_DJANGO_ROOT, _DJANGO_ROOT.parent):
    if str(root) not in sys.path:
        sys.path.insert(0, str(root))


def _get_sentence_model():
    from apps.classroom.rag.embedder import get_sentence_model
    return get_sentence_model()


def _get_collection():
    from apps.classroom.rag.store import get_collection
    collection, _ = get_collection()
    return collection


def is_ready():
    from apps.classroom.rag.store import is_ready as collection_ready
    return collection_ready()


def _sync_search(query, top_k):
    if top_k <= 0 or not query.strip():
        return ""
    try:
        collection = _get_collection()
        if collection is None:
            return ""
        from apps.classroom.rag.embedder import embed_query
        result = collection.query(query_embeddings=[embed_query(query)], n_results=top_k, include=["documents"])
        return "\n\n---\n\n".join(result["documents"][0])
    except Exception:
        logger.exception("FAISS retrieval unavailable")
        return ""


async def search(query: str, top_k: int = 3) -> str:
    return await asyncio.to_thread(_sync_search, query, top_k)
