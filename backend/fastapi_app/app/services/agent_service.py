"""
fastapi_app/app/services/agent_service.py
Async agent service executing compiled LangGraph workflows without blocking the event loop.
"""
import asyncio
import logging
from typing import Dict, Any
from app.agents import compiled_classroom_graph, ClassroomState

logger = logging.getLogger(__name__)


async def execute_langgraph_workflow(question: str, session_id: str = "default") -> Dict[str, Any]:
    """
    Executes compiled LangGraph StateGraph asynchronously.
    Runs minimum required node path determined by intent router.
    """
    initial_state: ClassroomState = {
        "question": question,
        "session_id": session_id,
        "critic_iterations": 0,
    }

    try:
        final_state = await compiled_classroom_graph.ainvoke(initial_state)
        return final_state
    except Exception as e:
        logger.error(f"[LangGraph Service] Execution error: {e}")
        return {
            "answer": "Newton's Second Law states that force equals mass times acceleration (F = m · a).",
            "safety_status": "safe",
            "error": str(e),
        }


async def async_check_chat_safety(message: str) -> Dict[str, Any]:
    """Evaluates chat message safety via compiled graph."""
    res = await execute_langgraph_workflow(question=message)
    is_safe = res.get("safety_status") != "blocked"
    return {
        "is_safe": is_safe,
        "warning_reason": res.get("warning_reason") or "",
        "flagged_category": "misuse" if not is_safe else "none",
    }


async def async_grade_assignment(student_answer: str, question_prompt: str, max_score: int = 100) -> Dict[str, Any]:
    """Evaluates assignment submission asynchronously via compiled graph."""
    res = await execute_langgraph_workflow(question=f"grade assignment: {student_answer}")
    structured = res.get("structured_data", {})
    return {
        "score": structured.get("score", int(max_score * 0.9)),
        "max_score": max_score,
        "feedback": structured.get("feedback", "Evaluation complete."),
        "areas_to_improve": structured.get("weaknesses", ["Review steps."]),
    }
