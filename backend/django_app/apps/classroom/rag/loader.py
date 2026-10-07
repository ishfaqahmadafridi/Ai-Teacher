"""
PDF loading, text chunking, and atomic FAISS index construction.
"""
import logging
from math import ceil
from apps.classroom.constants import (
    PDF_PATH, VECTOR_INDEX_PATH, EMBEDDING_MODEL, CHUNK_SIZE, CHUNK_OVERLAP, EMBED_BATCH_SIZE,
)
from shared.services.faiss_store import FaissCollection
from apps.classroom.rag.embedder import get_sentence_model, embed_texts

logger = logging.getLogger(__name__)



def try_load_existing():
    """Load the last completely written, model-compatible FAISS snapshot."""
    try:
        col = FaissCollection.load(VECTOR_INDEX_PATH, EMBEDDING_MODEL)
        get_sentence_model()
        logger.info("[RAG] Loaded FAISS snapshot (%s passages)", col.count())
        return col
    except Exception as error:
        logger.info("[RAG] Index unavailable or incompatible: %s", error)
        return None


def build_from_pdf():
    """Slow path: embed the entire PDF into a new FAISS snapshot."""
    try:
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

    documents = []
    metadata = []
    vectors = []
    BATCH = EMBED_BATCH_SIZE
    total = ceil(len(chunks) / BATCH)
    for i in range(0, len(chunks), BATCH):
        batch = chunks[i: i + BATCH]
        texts = [d.page_content for d in batch]
        metas = [d.metadata for d in batch]
        embeddings = embed_texts(texts)
        documents.extend(texts)
        metadata.extend(metas)
        vectors.extend(embeddings)
        logger.info(f"[RAG] Batch {i//BATCH+1}/{total} embedded.")

    col = FaissCollection(documents, vectors, metadata, EMBEDDING_MODEL)
    col.save(VECTOR_INDEX_PATH)
    logger.info("[RAG] FAISS build complete: %s passages", col.count())
    return col
