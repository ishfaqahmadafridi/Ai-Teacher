"""
apps/classroom/views/ask_view.py

API View for student questions — blocking (non-streaming) mode.
For real-time token-by-token streaming, use the FastAPI endpoint:
  POST http://localhost:8001/api/v1/stream/ask
"""
from apps.classroom.utilities.serializer_data import validated_mapping
import logging
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema

from apps.classroom.services.blocking_lesson import prepare_blocking_lesson
from apps.classroom.serializers import AskRequestSerializer, AskResponseSerializer

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
        responses={200: AskResponseSerializer},
    )
    def post(self, request):
        if settings.CLASSROOM_REQUIRE_QUEUE:
            return Response({"error": "Submit lesson preparation through /api/lesson-jobs/."}, status=410)
        serializer = AskRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        request_data = validated_mapping(serializer.validated_data)
        try:
            response_data = prepare_blocking_lesson(request.user, request_data)
        except Exception:
            logger.exception("Blocking classroom request failed")
            return Response(
                {"error": "An unexpected server error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(response_data, status=status.HTTP_200_OK)
