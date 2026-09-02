"""
apps/dashboard/views/live_class_view.py

API View for listing scheduled and live class sessions.
"""

import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema

from apps.dashboard.services import get_live_classes, create_live_class
from apps.dashboard.serializers import (
    LiveClassSerializer,
    LiveClassCreateRequestSerializer,
)

logger = logging.getLogger(__name__)


class LiveClassListView(APIView):
    """
    GET /api/dashboard/live-classes/
    POST /api/dashboard/live-classes/

    Returns and creates live and scheduled classes in the database.
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

    @extend_schema(
        summary="Create Live or Scheduled Class",
        description="Creates and commits a new live class or timetable session in the database.",
        tags=["dashboard"],
        request=LiveClassCreateRequestSerializer,
        responses={201: LiveClassSerializer, 400: dict},
    )
    def post(self, request):
        serializer = LiveClassCreateRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            live_class = create_live_class(**serializer.validated_data)
            output_serializer = LiveClassSerializer(live_class)
            return Response(output_serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.exception(f"[LiveClassListView] Failed to create live class: {e}")
            return Response(
                {"error": "Failed to create live class", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

