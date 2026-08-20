"""
ChromaDB state management and non-blocking background initialization.
"""
import logging
import threading
from apps.classroom.rag.loader import try_load_existing, build_from_pdf
from apps.classroom.rag.embedder import get_sentence_model

logger = logging.getLogger(__name__)

_collection = None
_ready = False
_build_lock = threading.Lock()


def is_ready() -> bool:
    """Return True if ChromaDB collection is loaded and ready for search."""
    return _ready


def get_collection():
    """Get the active ChromaDB collection instance (loads/builds if needed)."""
    global _collection, _ready
    if _collection is not None:
        return _collection, get_sentence_model()

    with _build_lock:
        if _collection is not None:
            return _collection, get_sentence_model()

        col = try_load_existing()
        if col is None:
            col = build_from_pdf()

        if col is not None:
            _collection = col
            _ready = True

        return _collection, get_sentence_model()


def _background_init():
    """Background thread handler for loading or building ChromaDB vector store."""
    global _collection, _ready

    with _build_lock:
        if _ready:
            return

        logger.info("[RAG] Background init started...")
        col = try_load_existing()
        if col is None:
            try:
                col = build_from_pdf()
            except Exception as e:
                logger.warning(f"[RAG] Vector build skipped: {e}")
                col = None

        if col is not None:
            _collection = col
            _ready = True
            logger.info("[RAG] Background init complete. RAG is now active.")
        else:
            logger.info("[RAG] Vector RAG unavailable. AI Teacher will use direct knowledge base.")


def start_background_init():
    """Launch background thread for non-blocking initialization."""
    global _ready
    if _ready:
        return
    t = threading.Thread(target=_background_init, name="rag-init", daemon=True)
    t.start()
    logger.info("[RAG] Background init thread started.")
