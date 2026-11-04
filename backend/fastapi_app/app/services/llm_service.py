"""
app/services/llm_service.py

Async LLM streaming service for FastAPI.
Streams Gemini 2.5 Flash responses token-by-token using LangChain's
async streaming interface — powering SSE and WebSocket endpoints.
"""
import logging
from typing import AsyncGenerator

logger = logging.getLogger(__name__)

from app.langchain.prompts import SYSTEM_PROMPT, RAG_CONTEXT_TEMPLATE


def _build_llm(temperature: float = 0.7):
    """Build a LangChain Gemini LLM instance using app.langchain."""
    from app.langchain import get_langchain_llm
    return get_langchain_llm(temperature=temperature, streaming=True)


async def stream_answer(
    question: str,
    session_id: str = "default",
    temperature: float = 0.7,
    rag_context: str = "",
) -> AsyncGenerator[str, None]:
    """
    Async generator — yields Gemini response tokens one by one.

    Usage in SSE endpoint:
        async for token in stream_answer(question, session_id):
            yield f"data: {token}\n\n"

    Usage in WebSocket endpoint:
        async for token in stream_answer(question, session_id):
            await websocket.send_text(token)
    """
    from langchain_core.messages import HumanMessage, SystemMessage

    llm = _build_llm(temperature)
    if llm is None:
        # Graceful fallback — yield a single error message
        yield "I'm sorry, the AI service is currently unavailable. Please try again shortly."
        return

    messages = [SystemMessage(content=SYSTEM_PROMPT)]
    if rag_context:
        messages.append(HumanMessage(content=RAG_CONTEXT_TEMPLATE.format(rag_context=rag_context)))
    messages.append(HumanMessage(content=question))

    logger.info(f"[LLM] Starting stream for session='{session_id}' question='{question[:60]}'")

    try:
        async for chunk in llm.astream(messages):
            if chunk.text:
                yield chunk.text
    except Exception as e:
        logger.error(f"[LLM] Streaming error for session='{session_id}': {e}")
        yield "\n\nThe AI response was interrupted. Please try again shortly."
