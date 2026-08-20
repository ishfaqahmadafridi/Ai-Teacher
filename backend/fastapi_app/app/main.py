"""
app/main.py

FastAPI Inference Engine — entry point.

Responsibilities:
  - Streaming AI responses (SSE) via POST /api/v1/stream/ask
  - Real-time WebSocket classroom sessions via WS /api/v1/ws/classroom/{id}
  - Health check via GET /api/v1/health/
  - OpenAPI docs at GET /docs and GET /redoc

This service is intentionally SEPARATE from the Django backend.
Django handles: auth, dashboard search, session clearing, admin.
FastAPI handles: everything real-time and async.
"""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.router import api_router

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.
    Runs startup tasks before the server begins accepting requests.
    """
    logger.info("[FastAPI] Starting AI Teacher Inference Engine...")
    logger.info(f"[FastAPI] Docs available at: /docs and /redoc")

    # Warm up RAG model in background (non-blocking)
    import asyncio
    async def _warm_rag():
        try:
            from app.services.rag_service import _get_sentence_model, _get_chroma_collection
            import asyncio as _asyncio
            await _asyncio.to_thread(_get_sentence_model)
            await _asyncio.to_thread(_get_chroma_collection)
            logger.info("[FastAPI] RAG warm-up complete.")
        except Exception as e:
            logger.warning(f"[FastAPI] RAG warm-up skipped: {e}")

    asyncio.create_task(_warm_rag())
    yield
    logger.info("[FastAPI] Shutting down AI Teacher Inference Engine.")


# ── FastAPI Application ────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.PROJECT_NAME,
    description=(
        "AI Teacher Inference Engine — handles real-time streaming AI responses "
        "and WebSocket live classroom sessions. "
        "Auth, search, and admin are handled by the Django backend."
    ),
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(api_router, prefix=settings.API_V1_STR)
