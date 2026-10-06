"""Configurable classroom defaults; override with environment variables."""
import os
from pathlib import Path

DJANGO_ROOT = Path(__file__).resolve().parents[3]
DEFAULT_SESSION_ID = "default"
DEFAULT_TEMPERATURE = float(os.getenv("CLASSROOM_TEMPERATURE", "0.7"))
MAX_HISTORY_LENGTH = int(os.getenv("CLASSROOM_HISTORY_LIMIT", "40"))
GEMINI_MODEL = os.getenv("CLASSROOM_GEMINI_MODEL", "gemini-2.5-flash")
LLM_MAX_RETRIES = int(os.getenv("CLASSROOM_LLM_MAX_RETRIES", "2"))
LLM_CACHE_SIZE = int(os.getenv("CLASSROOM_LLM_CACHE_SIZE", "16"))
LLM_TIMEOUT = float(os.getenv("CLASSROOM_LLM_TIMEOUT", "30"))
EMBEDDING_MODEL = os.getenv("CLASSROOM_EMBEDDING_MODEL", "all-MiniLM-L6-v2")
PDF_PATH = Path(os.getenv("CLASSROOM_PDF_PATH", str(DJANGO_ROOT / "college-physics-2e_-_WEB.pdf")))
CHROMA_DIR = Path(os.getenv("CLASSROOM_CHROMA_DIR", str(DJANGO_ROOT / "apps" / "chroma_db")))
COLLECTION_NAME = os.getenv("CLASSROOM_COLLECTION_NAME", "physics_2e_minilm")
RAG_SOURCE = os.getenv("CLASSROOM_RAG_SOURCE", "college-physics-2e")
RAG_TOP_K = int(os.getenv("CLASSROOM_RAG_TOP_K", "3"))
CHUNK_SIZE = int(os.getenv("CLASSROOM_CHUNK_SIZE", "800"))
CHUNK_OVERLAP = int(os.getenv("CLASSROOM_CHUNK_OVERLAP", "150"))
EMBED_BATCH_SIZE = int(os.getenv("CLASSROOM_EMBED_BATCH_SIZE", "100"))
MODEL_ARCHITECTURE = "LangChain-Gemini-RAG"
FALLBACK_SPEECH = (
    "I am having a little technical difficulty right now. "
    "Please ask your question again and I will explain it properly."
)
