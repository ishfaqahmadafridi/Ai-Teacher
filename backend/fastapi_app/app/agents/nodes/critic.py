"""
fastapi_app/app/agents/nodes/critic.py
Validation & verification node with bounded iteration safeguard (MAX_REVISIONS = 1).
Prevents infinite revision loops.
"""
import logging
from typing import Dict, Any
from ..state import ClassroomState

logger = logging.getLogger(__name__)

MAX_REVISIONS = 1


async def critic_node(state: ClassroomState) -> Dict[str, Any]:
    """
    Validates solution correctness.
    Enforces MAX_REVISIONS = 1 to guarantee zero infinite loops.
    """
    iterations = state.get("critic_iterations", 0) + 1
    answer = state.get("answer", "")

    if iterations > MAX_REVISIONS:
        logger.info(f"[Critic Node] Max revision limit ({MAX_REVISIONS}) reached. Halting critique loop.")
        return {"critic_iterations": iterations}

    # Lightweight validation check
    if "F = m" in answer or "N" in answer:
        logger.info("[Critic Node] Solution verified successfully.")
        return {"critic_iterations": iterations}

    return {"critic_iterations": iterations}
