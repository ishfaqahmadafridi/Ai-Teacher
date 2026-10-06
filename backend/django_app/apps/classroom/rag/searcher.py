"""
Public search API querying the physics textbook vector store.
"""
import logging
from apps.classroom.constants import RAG_TOP_K
from apps.classroom.rag.store import is_ready, get_collection
from apps.classroom.rag.embedder import embed_query

logger = logging.getLogger(__name__)


def search(query: str, top_k: int = RAG_TOP_K) -> str:
    """
    Search the physics textbook for passages relevant to the query.

    NON-BLOCKING: if the collection isn't ready yet (still building),
    returns "" immediately so Gemini can answer from its own knowledge.
    """
    if top_k <= 0 or not query.strip():
        return ""
    if not is_ready():
        logger.info("[RAG] Collection not ready yet — skipping RAG for this request.")
        return ""

    try:
        col, _ = get_collection()
        if col is None:
            return ""

        count = col.count()
        if not count:
            return ""
        q_emb = embed_query(query)
        results = col.query(
            query_embeddings=[q_emb],
            n_results=min(top_k, count),
            include=["documents"],
        )
        passages = results.get("documents", [[]])[0]
        if not passages:
            return ""
        combined = "\n\n---\n\n".join(passages)
        logger.info(f"[RAG] Retrieved {len(passages)} passages for: '{query[:60]}'")
        return combined
    except Exception as e:
        logger.error(f"[RAG] Search error: {e}")
        return ""
