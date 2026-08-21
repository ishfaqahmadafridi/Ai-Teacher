"""
apps/dashboard/views/overview_view.py

API View for Dashboard Overview analytics and student summary metrics.
"""

import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema

from apps.dashboard.services import get_dashboard_overview
from apps.dashboard.serializers import DashboardOverviewSerializer

logger = logging.getLogger(__name__)


class DashboardOverviewView(APIView):
    """
    GET /api/dashboard/overview/

    Retrieves aggregated student performance metrics, active field,
    registered courses, upcoming classes, and pending tasks.
    """

    @extend_schema(
        summary="Dashboard Overview Analytics & Summary",
        description="Returns consolidated student analytics, enrolled courses, and upcoming schedule.",
        tags=["dashboard"],
        responses={200: DashboardOverviewSerializer},
    )
    def get(self, request):
        try:
            overview_data = get_dashboard_overview()
            serializer = DashboardOverviewSerializer(data=overview_data)
            serializer.is_valid(raise_exception=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.exception(f"[DashboardOverviewView] Failed to fetch overview: {e}")
            return Response(
                {"error": "Failed to fetch dashboard overview", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
