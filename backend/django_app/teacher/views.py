"""
Teacher API views.

Endpoints:
    POST /api/ask/     — Student sends a question; returns structured JSON chunks.
    POST /api/clear/   — Clear conversation history for a session.
    GET  /api/health/  — Returns server health status.
"""
import logging

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from teacher.inference import generate_answer, clear_session

logger = logging.getLogger(__name__)


class AskView(APIView):
    """
    POST /api/ask/

    Accepts a student question and returns the AI professor's structured response
    as an array of "chunks" — each with a spoken sentence and a diagram action.

    Request body:
        {
            "question":   "What is gravity?",
            "session_id": "user-abc123",   // optional
            "temperature": 0.7             // optional
        }

    Response:
        {
            "chunks": [
                {
                    "speak": "Have you ever dropped your phone?...",
                    "diagram": { "action": "highlight", "target": "earth" }
                },
                ...
            ],
            "topic": "gravity",
            "diagram_type": "gravity",
            "language": "en",
            "tokens_used": 312,
            "model_info": { ... }
        }
    """

    def post(self, request):
        # Validate required field
        question = request.data.get("question", "").strip()
        if not question:
            return Response(
                {"error": "Field 'question' is required and cannot be empty."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        session_id   = request.data.get("session_id", "default")
        temperature  = float(request.data.get("temperature", 0.7))

        logger.info(f"[AskView] session={session_id!r} question='{question[:80]}'")

        try:
            result = generate_answer(
                question=question,
                session_id=session_id,
                temperature=temperature,
            )
        except Exception as e:
            logger.exception(f"[AskView] Unexpected error: {e}")
            return Response(
                {"error": "An unexpected server error occurred.", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(result, status=status.HTTP_200_OK)


class ClearSessionView(APIView):
    """
    POST /api/clear/

    Clears conversation memory for a given session so the student can start fresh.
    """

    def post(self, request):
        session_id = request.data.get("session_id", "default")
        clear_session(session_id)
        logger.info(f"[ClearSessionView] Cleared session: {session_id!r}")
        return Response({"status": "cleared", "session_id": session_id})


class HealthView(APIView):
    """GET /api/health/ — Returns server health / readiness status."""

    def get(self, request):
        return Response(
            {"status": "ready", "model": "gemini-2.5-flash", "rag": "college-physics-2e"},
            status=status.HTTP_200_OK,
        )
