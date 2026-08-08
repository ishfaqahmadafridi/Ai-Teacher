"""
SentenceTransformer embedding model loader and text vector encoding utilities.
"""
import logging

logger = logging.getLogger(__name__)

_sentence_model = None


def get_sentence_model():
    """Load sentence-transformers model (cached after first load)."""
    global _sentence_model
    if _sentence_model is not None:
        return _sentence_model
    from sentence_transformers import SentenceTransformer
    logger.info("[RAG] Loading sentence-transformers model (all-MiniLM-L6-v2)...")
    _sentence_model = SentenceTransformer("all-MiniLM-L6-v2")
    logger.info("[RAG] sentence-transformers model loaded.")
    return _sentence_model


def embed_texts(texts: list) -> list:
    """Embed a list of text strings into vectors."""
    model = get_sentence_model()
    return model.encode(texts, convert_to_numpy=True, show_progress_bar=False).tolist()


def embed_query(query: str) -> list:
    """Embed a single query string into a vector."""
    model = get_sentence_model()
    return model.encode([query], convert_to_numpy=True, show_progress_bar=False)[0].tolist()
