"""Use the shared bounded retrieval service; never invent passages or citations."""
from ..state import ClassroomState


async def retrieval_node(state: ClassroomState) -> dict:
    from app.services.stream_context import get_stream_context
    context = await get_stream_context(state.get('question', ''))
    return {
        'retrieved_context': [{'passage': context}] if context else [],
        # Plain-text retrieval supplies no verified page or chapter identifiers.
        'citations': [],
    }
