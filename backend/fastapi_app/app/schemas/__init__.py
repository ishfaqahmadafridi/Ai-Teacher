"""
app/schemas/__init__.py
"""
from .classroom import AskRequest, StreamChunk, WebSocketMessage, HealthResponse
from .agent_schemas import (
    ChatSafetyRequest,
    ChatSafetyResponse,
    GradeAssignmentRequest,
    GradeAssignmentResponse,
    TimetableRequest,
    TimetableResponse,
)

__all__ = [
    "AskRequest",
    "StreamChunk",
    "WebSocketMessage",
    "HealthResponse",
    "ChatSafetyRequest",
    "ChatSafetyResponse",
    "GradeAssignmentRequest",
    "GradeAssignmentResponse",
    "TimetableRequest",
    "TimetableResponse",
]
