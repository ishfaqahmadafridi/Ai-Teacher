"""
fastapi_app/app/agents/nodes/tutor.py
Single-responsibility tutoring & teaching node.
Generates structured response enriched with optional RAG context.
"""
import logging
from typing import Dict, Any
from app.agents.state import ClassroomState
from app.services.llm_service import _build_llm

logger = logging.getLogger(__name__)


async def tutor_node(state: ClassroomState) -> Dict[str, Any]:
    """
    Generates clear, pedagogical AI teaching response.
    Reuses retrieved context if available without re-querying.
    """
    question = state.get("question", "")
    context = state.get("retrieved_context", [])

    context_str = ""
    if context:
        context_str = "\n".join([item.get("passage", "") for item in context])

    llm = _build_llm(temperature=0.7)
    if llm is None:
        return {"answer": "Physics concept: Force equals mass times acceleration (F = m * a)."}

    prompt = (
        "You are an expert AI Physics Tutor. "
        "Explain the following concept clearly and concisely.\n"
    )
    if context_str:
        prompt += f"Context: {context_str}\n"
    prompt += f"Question: {question}"

    try:
        response = await llm.ainvoke(prompt)
        return {
            "answer": str(response.content),
        }
    except Exception as e:
        logger.error(f"[Tutor Node] LLM invocation error: {e}")
        return {
            "answer": f"Newton's Second Law defines force as the product of mass and acceleration (F = m · a).",
        }
