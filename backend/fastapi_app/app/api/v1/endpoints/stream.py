"""
app/api/v1/endpoints/stream.py

Server-Sent Events (SSE) streaming endpoint for real-time AI responses.

Flow:
  1. Student sends POST /api/v1/stream/ask with { question, session_id }
  2. FastAPI runs async RAG search (non-blocking)
  3. FastAPI streams Gemini tokens word-by-word via SSE
  4. Frontend receives tokens as they arrive — no waiting for full response

This replaces the blocking Django POST /api/ask/ endpoint for
real-time classroom usage.
"""
import json
import logging
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.schemas import AskRequest
from app.services.llm_service import stream_answer
from app.services.rag_service import search as rag_search

logger = logging.getLogger(__name__)
router = APIRouter()


async def _token_event_generator(request: AskRequest):
    """
    Async generator that yields SSE-formatted events.

    SSE format per RFC:
        data: <json payload>\n\n

    Yields:
        - data events with {"token": "...", "done": false, "session_id": "..."}
        - final data event with {"token": "", "done": true, "session_id": "..."}
    """
    logger.info(
        f"[SSE] Stream started | session='{request.session_id}' "
        f"question='{request.question[:60]}'"
    )

    # Step 1: Async RAG search (non-blocking)
    rag_context = await rag_search(request.question, top_k=3)

    # Step 2: Stream Gemini tokens
    try:
        async for token in stream_answer(
            question=request.question,
            session_id=request.session_id,
            temperature=request.temperature,
            rag_context=rag_context,
        ):
            payload = json.dumps({
                "token": token,
                "done": False,
                "session_id": request.session_id,
            })
            yield f"data: {payload}\n\n"

        # Final "done" event
        final = json.dumps({
            "token": "",
            "done": True,
            "session_id": request.session_id,
        })
        yield f"data: {final}\n\n"

    except Exception as e:
        logger.error(f"[SSE] Stream error for session='{request.session_id}': {e}")
        error_payload = json.dumps({
            "token": f"[Error: {str(e)}]",
            "done": True,
            "session_id": request.session_id,
        })
        yield f"data: {error_payload}\n\n"


@router.post(
    "/ask",
    summary="Stream AI professor response token-by-token",
    tags=["classroom"],
    response_description="Server-Sent Events stream of AI response tokens",
)
async def stream_ask(request: AskRequest) -> StreamingResponse:
    """
    **Streaming AI Response** via Server-Sent Events (SSE).

    The response is streamed word-by-word from Gemini 2.5 Flash,
    enriched with relevant passages from the physics textbook (RAG).

    ### How to consume in the frontend:
    ```javascript
    const es = new EventSource('/api/v1/stream/ask', { method: 'POST', body: ... });
    es.onmessage = (e) => {
      const { token, done } = JSON.parse(e.data);
      if (done) es.close();
      else appendToken(token);
    };
    ```
    """
    return StreamingResponse(
        _token_event_generator(request),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",        # Disable nginx buffering
            "Connection": "keep-alive",
        },
    )
