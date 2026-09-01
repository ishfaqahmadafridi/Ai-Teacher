"""
fastapi_app/app/agents/state.py
Minimal typed graph state for high-performance LangGraph execution.
"""
from typing import List, Dict, Any, Optional
from typing_extensions import TypedDict



class ClassroomState(TypedDict, total=False):
    """
    Lightweight, typed graph state.
    Avoids storing large raw documents or unneeded objects.
    """
    request_id: str
    session_id: str
    student_id: str
    course_id: str
    lesson_id: str

    question: str
    messages: List[Dict[str, str]]

    intent: str  # "tutor", "knowledge", "math", "assignment", "quiz", "study_plan", "unsupported"
    confidence: float

    safety_status: str  # "safe", "flagged", "blocked"
    warning_reason: Optional[str]

    retrieved_context: List[Dict[str, Any]]
    student_context: Dict[str, Any]
    course_context: Dict[str, Any]

    answer: str
    structured_data: Dict[str, Any]
    citations: List[str]

    critic_iterations: int
    error: Optional[str]
    metadata: Dict[str, Any]
