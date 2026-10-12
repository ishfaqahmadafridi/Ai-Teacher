"""
app/api/v1/router.py

Main API v1 router — combines all feature endpoint routers.

Routes registered:
  GET  /api/v1/health/              → Health check with RAG status
  POST /api/v1/stream/ask           → SSE streaming AI response
  WS   /api/v1/ws/classroom/{id}   → WebSocket live classroom session
"""
from fastapi import APIRouter, Depends
from app.core.security import require_access_token
from app.api.v1.endpoints import health, stream, websocket, agents

api_router = APIRouter()

api_router.include_router(
    health.router,
    prefix="/health",
    tags=["health"],
)

api_router.include_router(
    stream.router,
    dependencies=[Depends(require_access_token)],
    prefix="/stream",
    tags=["classroom"],
)

api_router.include_router(
    websocket.router,
    prefix="/ws",
    tags=["classroom"],
)

api_router.include_router(
    agents.router,
    dependencies=[Depends(require_access_token)],
    prefix="/agents",
    tags=["agents"],
)
