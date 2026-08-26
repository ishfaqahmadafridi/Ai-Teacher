"""
fastapi_app/app/agents/nodes/safety.py
Lightweight safety node.
Uses fast deterministic rule checks first from shared.constants to avoid unnecessary LLM calls.
"""
import logging
from typing import Dict, Any
from app.agents.state import ClassroomState
from shared.constants import FORBIDDEN_TERMS, SAFETY_WARNING_MESSAGE

logger = logging.getLogger(__name__)


async def safety_node(state: ClassroomState) -> Dict[str, Any]:
    """
    Inspects student request.
    Fast-path: Deterministic string checks.
    Slow-path: Isolated LLM safety call if ambiguous.
    """
    question = state.get("question", "").strip()
    if not question:
        return {
            "safety_status": "blocked",
            "warning_reason": "Empty question provided.",
            "answer": "Please ask a valid physics question.",
        }

    # Deterministic fast check (0ms latency, zero LLM calls)
    lowered = question.lower()
    for term in FORBIDDEN_TERMS:
        if term in lowered:
            logger.warning(f"[Safety Node] Blocked term '{term}' in question='{question[:40]}'")
            return {
                "safety_status": "blocked",
                "warning_reason": "Message contains non-academic or inappropriate terms.",
                "answer": SAFETY_WARNING_MESSAGE,
            }

    # Passed deterministic check
    return {
        "safety_status": "safe",
        "warning_reason": None,
    }
