"""
PDF loading, text chunking, and ChromaDB collection building utilities.
"""
import logging
from math import ceil
from apps.classroom.constants import (
    PDF_PATH, CHROMA_DIR, COLLECTION_NAME, CHUNK_SIZE, CHUNK_OVERLAP, EMBED_BATCH_SIZE,
)
from apps.classroom.rag.embedder import get_sentence_model, embed_texts

logger = logging.getLogger(__name__)



def try_load_existing():
    """Fast path: load collection that was already embedded on disk."""
    try:
        import chromadb
        client = chromadb.PersistentClient(path=str(CHROMA_DIR))
        col = client.get_collection(COLLECTION_NAME)
        count = col.count()
        if count == 0 or (col.metadata or {}).get("indexing_complete") is False:
            logger.info("[RAG] Existing collection is empty — will rebuild.")
            return None
        logger.info(f"[RAG] Loaded existing collection '{COLLECTION_NAME}' ({count} chunks). Preloading embedding model...")
        get_sentence_model()   # preload model so first search is instant
        logger.info("[RAG] Ready (loaded from disk).")
        return col
    except Exception as e:
        logger.info(f"[RAG] No existing collection: {e}")
        return None


def build_from_pdf():
    """Slow path: embed the entire PDF into ChromaDB."""
    try:
        import chromadb
        from langchain_community.document_loaders import PyPDFLoader
        from langchain_text_splitters import RecursiveCharacterTextSplitter
    except (ImportError, ModuleNotFoundError) as e:
        logger.warning(f"[RAG] Missing dependency for RAG: {e}")
        return None

    if not PDF_PATH.exists():
        logger.error(f"[RAG] PDF not found at {PDF_PATH}. RAG disabled.")
        return None

    logger.info(f"[RAG] Building collection from PDF: {PDF_PATH}")
    loader = PyPDFLoader(str(PDF_PATH))
    pages = loader.load()
    logger.info(f"[RAG] Loaded {len(pages)} pages.")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP,
    )
    chunks = splitter.split_documents(pages)
    logger.info(f"[RAG] Split into {len(chunks)} chunks.")

    if not chunks:
        logger.warning("PDF contains no extractable text; collection unchanged.")
        return None
    if EMBED_BATCH_SIZE <= 0:
        raise ValueError("CLASSROOM_EMBED_BATCH_SIZE must be positive")
    get_sentence_model()

    client = chromadb.PersistentClient(path=str(CHROMA_DIR))
    col = client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )
    col.modify(metadata={**(col.metadata or {}), "indexing_complete": False})

    BATCH = EMBED_BATCH_SIZE
    total = ceil(len(chunks) / BATCH)
    for i in range(0, len(chunks), BATCH):
        batch = chunks[i: i + BATCH]
        texts = [d.page_content for d in batch]
        metas = [d.metadata for d in batch]
        ids = [f"chunk-{i+j}" for j in range(len(batch))]
        embeddings = embed_texts(texts)
        col.upsert(documents=texts, embeddings=embeddings, metadatas=metas, ids=ids)
        logger.info(f"[RAG] Batch {i//BATCH+1}/{total} embedded.")

    # Remove chunks left over if the configured PDF became shorter.
    old_ids = col.get(include=[])["ids"]
    valid_ids = {f"chunk-{index}" for index in range(len(chunks))}
    stale_ids = [chunk_id for chunk_id in old_ids if chunk_id not in valid_ids]
    for offset in range(0, len(stale_ids), BATCH):
        col.delete(ids=stale_ids[offset:offset + BATCH])
    col.modify(metadata={**(col.metadata or {}), "indexing_complete": True})
    logger.info("[RAG] Collection build complete.")
    return col
