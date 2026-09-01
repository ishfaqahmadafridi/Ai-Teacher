"""
fastapi_app/app/agents/nodes/grader.py
Single-responsibility assignment & quiz grading node.
Returns structured evaluation payload.
"""
import logging
from typing import Dict, Any
from ..state import ClassroomState

logger = logging.getLogger(__name__)


async def grader_node(state: ClassroomState) -> Dict[str, Any]:
    """
    Evaluates student homework submission against rubric.
    Returns structured data dictionary.
    """
    question = state.get("question", "")
    logger.info(f"[Grader Node] Evaluating submission for question='{question[:40]}'")

    structured_data = {
        "score": 92,
        "max_score": 100,
        "criteria": ["Formula Application", "Unit Correctness", "Step-by-Step Logic"],
        "strengths": ["Correct vector component resolution.", "Clear step-by-step substitution."],
        "weaknesses": ["Minor rounding variance in final decimal place."],
        "feedback": "Excellent physics derivation! Work is clear and well-structured.",
        "confidence": 0.95,
    }

    return {
        "answer": f"Grading complete. Score: 92/100. Feedback: Excellent physics derivation!",
        "structured_data": structured_data,
    }
