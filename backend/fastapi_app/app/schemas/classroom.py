"""
app/schemas/classroom.py

Pydantic request/response models for the Classroom AI feature.
Used by both the streaming endpoint and the WebSocket endpoint.
"""
from pydantic import BaseModel, Field
from typing import Optional


class AskRequest(BaseModel):
    """Request body for the streaming AI ask endpoint."""
    question: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="The student's question to the AI professor.",
        examples=["What is Newton's second law of motion?"],
    )
    session_id: str = Field(
        default="default",
        max_length=100,
        description="Unique session identifier for conversation memory.",
        examples=["student-session-abc123"],
    )
    temperature: float = Field(
        default=0.7,
        ge=0.0,
        le=1.0,
        description="LLM sampling temperature. Lower = more focused, Higher = more creative.",
    )


class StreamChunk(BaseModel):
    """A single streamed token chunk from the AI."""
    token: str = Field(description="A single word or token from the AI response.")
    done: bool = Field(default=False, description="True on the final chunk.")
    session_id: str = Field(description="Echo of the request session_id.")


class WebSocketMessage(BaseModel):
    """Message schema for WebSocket classroom communication."""
    question: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="Student question sent over WebSocket.",
    )
    temperature: Optional[float] = Field(
        default=0.7,
        ge=0.0,
        le=1.0,
    )


class HealthResponse(BaseModel):
    """Health check response schema."""
    status: str = Field(description="Service health status.", examples=["ok"])
    service: str = Field(description="Service name.", examples=["fastapi-inference"])
    version: str = Field(default="1.0.0", description="API version.")
    rag_ready: bool = Field(
        default=False,
        description="True if the ChromaDB RAG vector store is loaded and ready.",
    )
