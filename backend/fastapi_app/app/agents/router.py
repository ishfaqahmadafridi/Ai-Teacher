"""
fastapi_app/app/agents/router.py
Fast intent classification router.
Executes minimum required path to minimize latency and LLM costs.
Shared constants imported from shared.constants following AGENTS.md rules.
"""
import logging
from typing import Dict, Any
from .state import ClassroomState
from shared.constants import (
    INTENT_ASSIGNMENT_KEYWORDS,
    INTENT_QUIZ_KEYWORDS,
    INTENT_PLANNER_KEYWORDS,
    INTENT_MATH_OPERATORS,
    INTENT_MATH_KEYWORDS,
    INTENT_KNOWLEDGE_KEYWORDS,
    INTENT_NODE_MAPPING,
)

logger = logging.getLogger(__name__)


async def route_intent(state: ClassroomState) -> Dict[str, Any]:
    """
    Classifies student intent.
    Intents: 'tutor', 'knowledge', 'math', 'assignment', 'quiz', 'study_plan', 'unsupported'
    """
    question = state.get("question", "").lower().strip()

    # Fast deterministic rules (0ms latency using centralized constants)
    if any(term in question for term in INTENT_ASSIGNMENT_KEYWORDS):
        return {"intent": "assignment", "confidence": 0.98}

    if any(term in question for term in INTENT_QUIZ_KEYWORDS):
        return {"intent": "quiz", "confidence": 0.95}

    if any(term in question for term in INTENT_PLANNER_KEYWORDS):
        return {"intent": "study_plan", "confidence": 0.95}

    if any(char in question for char in INTENT_MATH_OPERATORS) or any(word in question for word in INTENT_MATH_KEYWORDS):
        return {"intent": "math", "confidence": 0.92}

    if any(term in question for term in INTENT_KNOWLEDGE_KEYWORDS):
        return {"intent": "knowledge", "confidence": 0.90}

    # Default lightweight tutoring path
    return {"intent": "tutor", "confidence": 0.85}


def select_next_node(state: ClassroomState) -> str:
    """
    Conditional edge function mapping intent to next node name.
    """
    if state.get("safety_status") == "blocked":
        return "end"

    intent = state.get("intent", "tutor")
    return INTENT_NODE_MAPPING.get(intent, "tutor_node")
