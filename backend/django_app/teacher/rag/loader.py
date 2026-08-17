"""
PDF loading, text chunking, and ChromaDB collection building utilities.
"""
import logging
from pathlib import Path
from teacher.rag.embedder import get_sentence_model, embed_texts

logger = logging.getLogger(__name__)

PDF_PATH = Path(__file__).resolve().parents[3] / "college-physics-2e_-_WEB.pdf"
CHROMA_DIR = Path(__file__).resolve().parents[2] / "chroma_db"
COLLECTION_NAME = "physics_2e_minilm"


def try_load_existing():
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
        chunk_size=800, chunk_overlap=150,
        separators=["\n\n", "\n", ".", " "],
    )
    chunks = splitter.split_documents(pages)
    logger.info(f"[RAG] Split into {len(chunks)} chunks.")

    get_sentence_model()

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
        texts = [d.page_content for d in batch]
        metas = [d.metadata for d in batch]
        ids = [f"chunk-{i+j}" for j in range(len(batch))]
        embeddings = embed_texts(texts)
        col.add(documents=texts, embeddings=embeddings, metadatas=metas, ids=ids)
        logger.info(f"[RAG] Batch {i//BATCH+1}/{total} embedded.")

    logger.info("[RAG] Collection build complete.")
    return col
