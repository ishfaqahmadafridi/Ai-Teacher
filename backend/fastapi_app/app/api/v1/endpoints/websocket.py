"""
app/api/v1/endpoints/websocket.py

WebSocket endpoint for real-time bidirectional AI classroom sessions.

Flow:
  1. Frontend connects: WS /api/v1/ws/classroom/{session_id}
  2. Frontend sends JSON: {"question": "...", "temperature": 0.7}
  3. FastAPI runs async RAG search, then streams Gemini tokens back
  4. Frontend receives tokens as they arrive on the same WS connection
  5. Student can ask next question without reconnecting

This enables true real-time live classroom experience.
"""
import asyncio
import json
from app.core.security import access_identity, private_session
from app.core.config import settings
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.schemas import WebSocketMessage
from app.services.llm_service import stream_answer
from app.services.rag_service import search as rag_search

logger = logging.getLogger(__name__)
router = APIRouter()


@router.websocket("/classroom/{session_id}")
async def websocket_classroom(websocket: WebSocket, session_id: str):
    """
    **Live Classroom WebSocket Session**

    Accepts student questions over WebSocket and streams AI professor
    responses token-by-token on the same connection.

    ### Message format (client → server):
    ```json
    {"question": "What is Newton's third law?", "temperature": 0.7}
    ```

    ### Stream format (server → client):
    ```json
    {"token": "Newton's", "done": false}
    {"token": " third", "done": false}
    {"token": " law...", "done": false}
    {"token": "", "done": true}
    ```

    ### Error format (server → client):
    ```json
    {"error": "Invalid message format. Expected JSON with 'question' field."}
    ```
    """
    await websocket.accept()
    # Browser clients authenticate in the first frame; tokens never enter URLs.
    try:
        authentication = await asyncio.wait_for(websocket.receive_json(), timeout=settings.WEBSOCKET_AUTH_TIMEOUT_SECONDS)
        identity = access_identity(authentication.get('token', '')) if isinstance(authentication, dict) else None
    except (TimeoutError, ValueError, WebSocketDisconnect):
        identity = None
    if identity is None:
        await websocket.close(code=1008)
        return
    session_id = private_session(identity, session_id)
    logger.info(f"[WS] Client connected | session='{session_id}'")

    try:
        while True:
            # ── Receive Question ──────────────────────────────────────────────
            raw = await websocket.receive_text()

            try:
                data = json.loads(raw)
                msg = WebSocketMessage(**data)
            except (json.JSONDecodeError, ValueError) as e:
                await websocket.send_text(json.dumps({
                    "error": f"Invalid message format. Expected JSON with 'question' field. ({e})"
                }))
                continue

            logger.info(
                f"[WS] Question received | session='{session_id}' "
                f"question='{msg.question[:60]}'"
            )

            # ── Step 1: Async RAG Search ──────────────────────────────────────
            rag_context = await rag_search(msg.question, top_k=3)

            # ── Step 2: Stream Gemini Tokens ──────────────────────────────────
            try:
                async for token in stream_answer(
                    question=msg.question,
                    session_id=session_id,
                    temperature=msg.temperature or 0.7,
                    rag_context=rag_context,
                ):
                    await websocket.send_text(json.dumps({
                        "token": token,
                        "done": False,
                    }))

                # Signal completion
                await websocket.send_text(json.dumps({
                    "token": "",
                    "done": True,
                }))

            except Exception as e:
                logger.error("WebSocket stream failed: %s", type(e).__name__)
                await websocket.send_text(json.dumps({
                    "error": "The teaching service is unavailable. Please retry.",
                    "done": True,
                }))

    except WebSocketDisconnect:
        logger.info(f"[WS] Client disconnected | session='{session_id}'")
    except Exception as e:
        logger.error("WebSocket failed: %s", type(e).__name__)
        try:
            await websocket.close(code=1011)
        except Exception:
            pass
