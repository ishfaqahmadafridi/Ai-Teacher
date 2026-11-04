"""
fastapi_app/app/services/agent_service.py
Async agent service executing compiled LangGraph workflows without blocking the event loop.
"""
import logging
from typing import Dict, Any, List, Optional
from app.agents import compiled_classroom_graph, ClassroomState
from app.agents.nodes.safety import safety_node
from app.core.errors import InferenceUnavailable

logger = logging.getLogger(__name__)


async def execute_langgraph_workflow(
    question: str,
    session_id: str = "default",
    course_id: str = "",
    metadata: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Executes compiled LangGraph StateGraph asynchronously with performance telemetry.
    Runs minimum required node path determined by intent router.
    """
    from app.core.telemetry import WorkflowTelemetry

    telemetry = WorkflowTelemetry(session_id=session_id)
    initial_state: ClassroomState = {
        "question": question,
        "session_id": session_id,
        "course_id": course_id,
        "metadata": metadata or {},
        "critic_iterations": 0,
    }

    try:
        final_state = await compiled_classroom_graph.ainvoke(initial_state)
        final_state["telemetry"] = telemetry.summary()
        return final_state
    except InferenceUnavailable:
        raise
    except Exception:
        logger.exception('Classroom workflow failed')
        raise InferenceUnavailable() from None



async def async_check_chat_safety(message: str) -> Dict[str, Any]:
    """Evaluates chat message safety via compiled graph."""
    res = await safety_node({'question': message})
    is_safe = res.get("safety_status") != "blocked"
    return {
        "is_safe": is_safe,
        "warning_reason": res.get("warning_reason") or "",
        "flagged_category": "misuse" if not is_safe else "none",
    }


async def async_grade_assignment(student_answer: str, question_prompt: str, max_score: int = 100) -> Dict[str, Any]:
    """Evaluates assignment submission asynchronously via compiled graph."""
    # Real lesson feedback is provided by Django's persisted understanding checks.
    # This legacy endpoint has no equivalent validated score/rubric implementation.
    raise InferenceUnavailable()


async def async_generate_timetable(
    registered_class: str = "",
    registered_courses: Optional[List[str]] = None,
    preferred_time: str = "morning",
    max_classes_per_day: int = 2,
    include_saturday: bool = True,
    available_hours: int = 2,
) -> Dict[str, Any]:
    """Generates personalized constraint-optimized timetable asynchronously."""
    from app.agents.nodes.planner import planner_node

    state: ClassroomState = {
        "course_id": registered_class,
        "metadata": {
            "registered_courses": registered_courses or ([registered_class] if registered_class else []),
            "preferred_time": preferred_time,
            "max_classes_per_day": max_classes_per_day,
            "include_saturday": include_saturday,
            "available_hours": available_hours,
        },
    }

    res = await planner_node(state)
    structured = res.get("structured_data", {})
    return {
        "class_name": structured.get("class_name", registered_class),
        "schedule": structured.get("schedule", []),
        "total_weekly_classes": structured.get("total_weekly_classes", 0),
        "optimization_summary": structured.get("optimization_summary", "Optimized schedule."),
    }

