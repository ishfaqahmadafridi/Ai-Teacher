"""
app/schemas/__init__.py
"""
from .classroom import AskRequest, StreamChunk, WebSocketMessage, HealthResponse

__all__ = [
    "AskRequest",
    "StreamChunk",
    "WebSocketMessage",
    "HealthResponse",
]
