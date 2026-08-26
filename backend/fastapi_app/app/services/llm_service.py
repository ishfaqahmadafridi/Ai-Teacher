"""
app/services/llm_service.py

Async LLM streaming service for FastAPI.
Streams Gemini 2.5 Flash responses token-by-token using LangChain's
async streaming interface — powering SSE and WebSocket endpoints.
"""
import asyncio
import logging
import os
from typing import AsyncGenerator

logger = logging.getLogger(__name__)

# ── System Prompt ─────────────────────────────────────────────────────────────
_SYSTEM_PROMPT = """You are an expert AI professor and academic tutor.
Your role is to explain complex concepts clearly, concisely, and engagingly.
Always respond in plain prose — no markdown, no bullet points, no code blocks
unless the student explicitly requests them.
Keep responses focused and educational."""

_RAG_SUFFIX = "\n\n[Relevant textbook context for your response]:\n{rag_context}"


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

    # Build system prompt (optionally enriched with RAG context)
    system_content = _SYSTEM_PROMPT
    if rag_context:
        system_content += _RAG_SUFFIX.format(rag_context=rag_context)

    messages = [
        SystemMessage(content=system_content),
        HumanMessage(content=question),
    ]

    logger.info(f"[LLM] Starting stream for session='{session_id}' question='{question[:60]}'")

    try:
        async for chunk in llm.astream(messages):
            token = chunk.content
            if token:
                token_str = token if isinstance(token, str) else str(token)
                yield token_str
    except Exception as e:
        logger.error(f"[LLM] Streaming error for session='{session_id}': {e}")
        yield f"\n\n[Error: {str(e)}]"
