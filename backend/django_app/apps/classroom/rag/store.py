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
_thread_lock = threading.Lock()
_init_thread = None


def is_ready() -> bool:
    """Return True if ChromaDB collection is loaded and ready for search."""
    return _ready


def get_collection():
    """Load or build once under the initialization lock."""
    global _collection, _ready
    with _build_lock:
        if _collection is None:
            col = try_load_existing()
            if col is None:
                col = build_from_pdf()
            if col is not None:
                model = get_sentence_model()
                _collection = col
                _ready = True
                return col, model
        if _collection is None:
            return None, None
        return _collection, get_sentence_model()


def _background_init():
    """Use the same initialization path as management commands."""
    try:
        get_collection()
    except Exception:
        logger.exception("RAG initialization failed")


def start_background_init():
    """Launch background thread for non-blocking initialization."""
    global _init_thread
    with _thread_lock:
        if _ready or (_init_thread is not None and _init_thread.is_alive()):
            return
        _init_thread = threading.Thread(target=_background_init, name="rag-init", daemon=True)
        _init_thread.start()
