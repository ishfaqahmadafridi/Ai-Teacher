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
    registered_class: str = Field(default="Physics Mechanics 101", description="Primary course title")
    registered_courses: List[str] = Field(default_factory=lambda: ["Physics Mechanics 101", "Calculus II", "Intro to CS"], description="List of registered courses")
    preferred_time: str = Field(default="morning", description="Preferred time of day: morning, afternoon, evening, any")
    max_classes_per_day: int = Field(default=2, ge=1, le=4, description="Maximum number of classes per day")
    include_saturday: bool = Field(default=True, description="Whether to include Saturday for labs and workshops")
    weak_topics: Optional[List[str]] = Field(default_factory=list, description="List of student weak topics needing extra focus")
    available_hours: int = Field(default=2, ge=1, le=12, description="Daily available study hours")


class TimetableResponse(BaseModel):
    class_name: str
    schedule: List[Dict[str, Any]]
    total_weekly_classes: int = Field(default=0, description="Total number of scheduled class sessions across the week")
    optimization_summary: str = Field(default="Optimized for balanced daily cognitive load", description="AI planner summary note")


class AgentWorkflowRequest(BaseModel):
    question: str = Field(..., description="Student question or task prompt")
    session_id: str = Field(default="default", description="Active session ID")
    course_id: Optional[str] = Field(default="Physics Mechanics 101", description="Associated course ID")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Optional extra metadata context")


class AgentWorkflowResponse(BaseModel):
    answer: str
    intent: str = "tutor"
    safety_status: str = "safe"
    structured_data: Optional[Dict[str, Any]] = None
    citations: List[str] = Field(default_factory=list)
    telemetry: Optional[Dict[str, Any]] = None


class AgentStreamEvent(BaseModel):
    event_type: str = Field(..., description="Type of stream event: 'token', 'node_start', 'node_end', 'done', 'error'")
    node: Optional[str] = None
    token: Optional[str] = None
    session_id: str = "default"
    done: bool = False
    metadata: Optional[Dict[str, Any]] = None


