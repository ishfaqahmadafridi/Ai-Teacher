"""
apps/dashboard/views/live_class_view.py

API View for listing scheduled and live class sessions.
"""

import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema

from apps.dashboard.services import get_live_classes
from apps.dashboard.serializers import LiveClassSerializer

logger = logging.getLogger(__name__)


class LiveClassListView(APIView):
    """
    GET /api/dashboard/live-classes/

    Returns the list of live and scheduled classes for the student.
    """

    @extend_schema(
        summary="List Live and Scheduled Classes",
        description="Returns list of scheduled workshops and live sessions.",
        tags=["dashboard"],
        responses={200: LiveClassSerializer(many=True)},
    )
    def get(self, request):
        try:
            live_classes = get_live_classes()
            serializer = LiveClassSerializer(live_classes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.exception(f"[LiveClassListView] Failed to fetch live classes: {e}")
            return Response(
                {"error": "Failed to fetch live classes", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
