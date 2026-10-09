"""
ONNX embedding model loader and text vector encoding utilities.
"""
import logging
import threading
import numpy as np
from apps.classroom.constants import EMBEDDING_MODEL, EMBED_THREADS, EMBED_CACHE_PATH

logger = logging.getLogger(__name__)

_sentence_model = None
_model_lock = threading.Lock()


def get_sentence_model():
    """Load the ONNX embedding model (cached after first load)."""
    global _sentence_model
    if _sentence_model is not None:
        return _sentence_model
    with _model_lock:
        if _sentence_model is None:
            from fastembed import TextEmbedding
            logger.info("Loading embedding model %s", EMBEDDING_MODEL)
            model_name = EMBEDDING_MODEL if "/" in EMBEDDING_MODEL else f"sentence-transformers/{EMBEDDING_MODEL}"
            _sentence_model = TextEmbedding(model_name=model_name, threads=EMBED_THREADS, cache_dir=str(EMBED_CACHE_PATH))
    return _sentence_model


def embed_texts(texts: list) -> list:
    """Embed a list of text strings into vectors."""
    model = get_sentence_model()
    return np.asarray(list(model.embed(texts)), dtype=np.float32).tolist()


def embed_query(query: str) -> list:
    """Embed a single query string into a vector."""
    model = get_sentence_model()
    return next(model.query_embed(query)).tolist()
