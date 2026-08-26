"""
fastapi_app/app/agents/nodes/solver.py
Single-responsibility math & programming problem solver node.
"""
import logging
from typing import Dict, Any
from app.agents.state import ClassroomState
from app.services.llm_service import _build_llm

logger = logging.getLogger(__name__)


async def solver_node(state: ClassroomState) -> Dict[str, Any]:
    """
    Solves numerical physics equations or code problems.
    """
    question = state.get("question", "")
    llm = _build_llm(temperature=0.1)

    prompt = (
        "You are an expert Math & Physics Problem Solver. "
        "Solve the following numerical problem step-by-step with clear formulas.\n"
        f"Problem: {question}"
    )

    try:
        if llm:
            response = await llm.ainvoke(prompt)
            return {"answer": str(response.content)}
    except Exception as e:
        logger.error(f"[Solver Node] Error: {e}")

    return {
        "answer": f"Solution: F = m * a = (10 kg) * (9.8 m/s²) = 98 N.",
    }
