"""
fastapi_app/app/schemas/agent_schemas.py
Pydantic schemas for FastAPI agent endpoints.
"""
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class ChatSafetyRequest(BaseModel):
    message: str = Field(..., description="Student chat message content", json_schema_extra={"example": "How does force affect mass?"})


class ChatSafetyResponse(BaseModel):
    is_safe: bool
    warning_reason: str = ""
    flagged_category: str = "none"


class GradeAssignmentRequest(BaseModel):
    student_answer: str = Field(..., description="Student answer submission")
    question_prompt: str = Field(..., description="Assignment question prompt")
    max_score: int = Field(default=100, ge=1)


class GradeAssignmentResponse(BaseModel):
    score: int
    max_score: int
    feedback: str
    areas_to_improve: List[str]


class TimetableRequest(BaseModel):
    registered_class: str = Field(default="Physics Mechanics 101")
    weak_topics: Optional[List[str]] = Field(default_factory=list)
    available_hours: int = Field(default=2, ge=1, le=12)


class TimetableResponse(BaseModel):
    class_name: str
    schedule: List[Dict[str, Any]]
