"""
fastapi_app/app/agents/nodes/retrieval.py
Asynchronous RAG context retrieval node.
Executes vector retrieval only when required by intent routing.
"""
import logging
from typing import Dict, Any
from ..state import ClassroomState

logger = logging.getLogger(__name__)


async def retrieval_node(state: ClassroomState) -> Dict[str, Any]:
    """
    Retrieves top-K relevant textbook passages asynchronously.
    Filters context to keep prompt payloads compact.
    """
    question = state.get("question", "")
    logger.info(f"[Retrieval Node] Fetching RAG context for question='{question[:40]}'")

    # Simulated lightweight RAG search (top-k=2)
    # In production, invokes vector DB (ChromaDB) async search
    context = [
        {"passage": "Newton's Second Law states F = m * a where F is net force, m is mass, and a is acceleration.", "source": "college-physics-2e"},
        {"passage": "Inertia is the tendency of an object to resist changes in its state of motion.", "source": "college-physics-2e"},
    ]

    return {
        "retrieved_context": context,
        "citations": ["College Physics 2e - Chapter 4"],
    }
