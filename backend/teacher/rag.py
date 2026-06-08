"""
RAG (Retrieval-Augmented Generation) module.

Loads the College Physics 2e PDF, splits it into chunks, embeds them using
a LOCAL sentence-transformers model (all-MiniLM-L6-v2), stores them in a
local ChromaDB vector store, and exposes a search() function.

KEY DESIGN — NON-BLOCKING:
    The ChromaDB rebuild (embedding thousands of PDF chunks) takes 3-5 minutes
    on CPU. If this happens inside a request handler, the request times out.

    Solution:
      - get_collection() is called once from apps.py ready() in a BACKGROUND THREAD
      - search() checks _ready flag; if not ready yet, returns "" immediately
      - Gemini then answers from its own training knowledge (graceful degradation)
      - Once the background thread finishes, all subsequent searches use ChromaDB

    Result: FIRST REQUEST is answered by Gemini alone in ~10-30 seconds.
            SUBSEQUENT REQUESTS get RAG-enhanced answers.
"""

import os
import logging
import threading
from pathlib import Path

logger = logging.getLogger(__name__)

# ── Paths ─────────────────────────────────────────────────────────────────────
PDF_PATH   = Path(__file__).resolve().parents[2] / "college-physics-2e_-_WEB.pdf"
CHROMA_DIR = Path(__file__).resolve().parents[1] / "chroma_db"
COLLECTION_NAME = "physics_2e_minilm"

# ── State ──────────────────────────────────────────────────────────────────────
_collection      = None       # ChromaDB collection
_sentence_model  = None       # sentence-transformers model
_ready           = False      # True once collection is loaded/built and ready to search
_build_lock      = threading.Lock()


# ── Embedding helpers ─────────────────────────────────────────────────────────

def _get_sentence_model():
    """Load sentence-transformers model (cached after first load)."""
    global _sentence_model
    if _sentence_model is not None:
        return _sentence_model
    from sentence_transformers import SentenceTransformer
    logger.info("[RAG] Loading sentence-transformers model (all-MiniLM-L6-v2)...")
    _sentence_model = SentenceTransformer("all-MiniLM-L6-v2")
    logger.info("[RAG] sentence-transformers model loaded.")
    return _sentence_model


def _embed_texts(texts: list) -> list:
    model = _get_sentence_model()
    return model.encode(texts, convert_to_numpy=True, show_progress_bar=False).tolist()


def _embed_query(query: str) -> list:
    model = _get_sentence_model()
    return model.encode([query], convert_to_numpy=True, show_progress_bar=False)[0].tolist()


# ── Collection build / load ───────────────────────────────────────────────────

def _try_load_existing():
    """Fast path: load collection that was already embedded on disk."""
    try:
        import chromadb
        client = chromadb.PersistentClient(path=str(CHROMA_DIR))
        col = client.get_collection(COLLECTION_NAME)
        count = col.count()
        if count == 0:
            logger.info("[RAG] Existing collection is empty — will rebuild.")
            return None
        logger.info(f"[RAG] Loaded existing collection '{COLLECTION_NAME}' ({count} chunks). Preloading embedding model...")
        _get_sentence_model()   # preload model so first search is instant
        logger.info("[RAG] Ready (loaded from disk).")
        return col
    except Exception as e:
        logger.info(f"[RAG] No existing collection: {e}")
        return None


def _build_from_pdf():
    """Slow path: embed the entire PDF. Takes 3-5 min on CPU. Runs in background."""
    import chromadb
    from langchain_community.document_loaders import PyPDFLoader
    from langchain_text_splitters import RecursiveCharacterTextSplitter

    if not PDF_PATH.exists():
        logger.error(f"[RAG] PDF not found at {PDF_PATH}. RAG disabled.")
        return None

    logger.info(f"[RAG] Building collection from PDF: {PDF_PATH}")
    loader  = PyPDFLoader(str(PDF_PATH))
    pages   = loader.load()
    logger.info(f"[RAG] Loaded {len(pages)} pages.")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800, chunk_overlap=150,
        separators=["\n\n", "\n", ".", " "],
    )
    chunks = splitter.split_documents(pages)
    logger.info(f"[RAG] Split into {len(chunks)} chunks.")

    # Preload model (downloads ~80 MB once, then cached)
    _get_sentence_model()

    client = chromadb.PersistentClient(path=str(CHROMA_DIR))
    try:
        client.delete_collection(COLLECTION_NAME)
    except Exception:
        pass

    col = client.create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )

    BATCH = 100
    total = (len(chunks) // BATCH) + 1
    for i in range(0, len(chunks), BATCH):
        batch = chunks[i: i + BATCH]
        texts     = [d.page_content for d in batch]
        metas     = [d.metadata     for d in batch]
        ids       = [f"chunk-{i+j}" for j in range(len(batch))]
        embeddings = _embed_texts(texts)
        col.add(documents=texts, embeddings=embeddings, metadatas=metas, ids=ids)
        logger.info(f"[RAG] Batch {i//BATCH+1}/{total} embedded.")

    logger.info("[RAG] Collection build complete.")
    return col


def _background_init():
    """
    Called once from teacher/apps.py ready() in a daemon thread.
    Loads or builds the ChromaDB collection without blocking any request.
    """
    global _collection, _ready

    with _build_lock:
        if _ready:
            return  # already done

        logger.info("[RAG] Background init started...")

        # Fast path first
        col = _try_load_existing()
        if col is None:
            # Slow path — build from PDF
            col = _build_from_pdf()

        if col is not None:
            _collection = col
            _ready = True
            logger.info("[RAG] Background init complete. RAG is now active.")
        else:
            logger.warning("[RAG] Could not initialise collection. Gemini will answer from own knowledge.")


def start_background_init():
    """
    Launch the background init thread.
    Safe to call multiple times — subsequent calls are no-ops.
    """
    global _ready
    if _ready:
        return
    t = threading.Thread(target=_background_init, name="rag-init", daemon=True)
    t.start()
    logger.info("[RAG] Background init thread started.")


# ── Public search API ──────────────────────────────────────────────────────────

def search(query: str, top_k: int = 3) -> str:
    """
    Search the physics textbook for passages relevant to the query.

    NON-BLOCKING: if the collection isn't ready yet (still building),
    returns "" immediately so Gemini can answer from its own knowledge.

    Args:
        query:  Student's question.
        top_k:  Number of passages to retrieve.

    Returns:
        Concatenated passage string, or "" if not ready or on error.
    """
    if not _ready or _collection is None:
        logger.info("[RAG] Collection not ready yet — skipping RAG for this request.")
        return ""

    try:
        q_emb = _embed_query(query)
        results = _collection.query(
            query_embeddings=[q_emb],
            n_results=top_k,
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
