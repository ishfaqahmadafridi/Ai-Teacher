"""
API View for student questions.
"""
import logging

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from teacher.inference import generate_answer

logger = logging.getLogger(__name__)


class AskView(APIView):
    """
    POST /api/ask/

    Accepts a student question and returns the AI professor's structured response
    as an array of "chunks" — each with a spoken sentence and a diagram action.
    """

    def post(self, request):
        question = request.data.get("question", "").strip()
        if not question:
            return Response(
                {"error": "Field 'question' is required and cannot be empty."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        session_id = request.data.get("session_id", "default")
        temperature = float(request.data.get("temperature", 0.7))

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
