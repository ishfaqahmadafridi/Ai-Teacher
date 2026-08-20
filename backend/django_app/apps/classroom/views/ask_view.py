"""
apps/classroom/views/ask_view.py

API View for student questions — blocking (non-streaming) mode.
For real-time token-by-token streaming, use the FastAPI endpoint:
  POST http://localhost:8001/api/v1/stream/ask
"""
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema

from apps.classroom.inference import generate_answer
from apps.classroom.serializers import AskRequestSerializer

logger = logging.getLogger(__name__)


class AskView(APIView):
    """
    POST /api/ask/

    Accepts a student question and returns the AI professor's full structured response.
    Note: This endpoint waits for the complete response before returning.
    For word-by-word streaming, use POST /api/v1/stream/ask on the FastAPI service.
    """

    @extend_schema(
        summary="Ask the AI professor a question (blocking mode)",
        description=(
            "Submits a student question to the AI professor and returns the full "
            "structured JSON response with spoken chunks and diagram actions. "
            "This endpoint blocks until the full answer is generated (~3-10 seconds). "
            "For real-time streaming responses, use the FastAPI streaming endpoint."
        ),
        tags=["classroom"],
        request=AskRequestSerializer,
        responses={
            200: {
                "description": "Structured AI professor response with spoken chunks.",
                "example": {
                    "chunks": [{"speak": "Newton's law states...", "diagram": {"action": "none"}}],
                    "topic": "gravity",
                    "diagram_type": "gravity",
                    "language": "en",
                    "tokens_used": 150,
                    "model_info": {"architecture": "LangChain-Gemini-RAG"},
                },
            },
            400: {"description": "Missing or empty 'question' field."},
        },
    )
    def post(self, request):
        serializer = AskRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        validated = serializer.validated_data
        question = validated["question"].strip()
        session_id = validated.get("session_id", "default")
        temperature = float(validated.get("temperature", 0.7))

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
