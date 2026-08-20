"""
app/api/v1/endpoints/health.py

Health check endpoint for the FastAPI Inference Engine.
Reports service status and RAG vector store readiness.
"""
import logging
from fastapi import APIRouter
from app.schemas import HealthResponse

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get(
    "/",
    response_model=HealthResponse,
    summary="FastAPI Inference Engine Health Check",
    tags=["health"],
)
async def health_check() -> HealthResponse:
    """
    Returns the health status of the FastAPI inference engine.
    Also reports whether the ChromaDB RAG vector store is available.
    """
    rag_ready = False
    try:
        from app.services.rag_service import _get_chroma_collection
        rag_ready = _get_chroma_collection() is not None
    except Exception:
        pass

    return HealthResponse(
        status="ok",
        service="fastapi-inference",
        version="1.0.0",
        rag_ready=rag_ready,
    )
