"""
app/services/rag_service.py

Async RAG (Retrieval-Augmented Generation) service for FastAPI.
Queries the shared ChromaDB vector store built by the Django classroom app.

Design: Async wrapper around the synchronous ChromaDB + sentence-transformer
calls, using asyncio.to_thread() so they never block the FastAPI event loop.
"""
import asyncio
import logging
import sys
from pathlib import Path

logger = logging.getLogger(__name__)

# ── Path Resolution ─────────────────────────────────────────────────────────
# Locate the shared Django backend so we can reuse the existing
# ChromaDB collection and sentence-transformer model without duplicating them.
_DJANGO_ROOT = Path(__file__).resolve().parents[3] / "django_app"
if str(_DJANGO_ROOT) not in sys.path:
    sys.path.insert(0, str(_DJANGO_ROOT))

# ChromaDB / collection constants (mirror apps/classroom/rag/loader.py)
CHROMA_DIR = _DJANGO_ROOT / "apps" / "classroom" / "chroma_db"
COLLECTION_NAME = "physics_2e_minilm"

_collection = None
_model = None


def _get_sentence_model():
    """Load sentence-transformer model (blocking, cached singleton)."""
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            _model = SentenceTransformer("all-MiniLM-L6-v2")
            logger.info("[RAG] Sentence model loaded.")
        except Exception as e:
            logger.warning(f"[RAG] Could not load sentence model: {e}")
            _model = None
    return _model


def _get_chroma_collection():
    """Load ChromaDB collection (blocking, cached singleton)."""
    global _collection
    if _collection is None:
        try:
            import chromadb
            client = chromadb.PersistentClient(path=str(CHROMA_DIR))
            _collection = client.get_collection(COLLECTION_NAME)
            logger.info(f"[RAG] ChromaDB collection loaded ({_collection.count()} chunks).")
        except Exception as e:
            logger.warning(f"[RAG] ChromaDB not available: {e}")
            _collection = None
    return _collection


def _sync_search(query: str, top_k: int = 3) -> str:
    """Synchronous ChromaDB search — run inside asyncio.to_thread()."""
    model = _get_sentence_model()
    col = _get_chroma_collection()

    if model is None or col is None:
        return ""

    try:
        q_emb = model.encode(query).tolist()
        results = col.query(
            query_embeddings=[q_emb],
            n_results=top_k,
            include=["documents"],
        )
        docs = results.get("documents") if results else None
        if not docs or not docs[0]:
            return ""
        passages = docs[0]
        combined = "\n\n---\n\n".join(passages)
        logger.info(f"[RAG] Retrieved {len(passages)} passages for: '{query[:60]}'")
        return combined
    except Exception as e:
        logger.error(f"[RAG] Search error: {e}")
        return ""


async def search(query: str, top_k: int = 3) -> str:
    """
    Async RAG search — non-blocking wrapper for FastAPI.

    Runs the synchronous ChromaDB + sentence-transformer search in a
    thread pool so it never blocks the FastAPI event loop.
    """
    return await asyncio.to_thread(_sync_search, query, top_k)
