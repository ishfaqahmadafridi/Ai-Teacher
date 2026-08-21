"""
apps/dashboard/views/assignment_view.py

API View for listing assignments, quizzes, and practice sets.
"""

import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema

from apps.dashboard.services import get_assignments
from apps.dashboard.serializers import AssignmentSerializer

logger = logging.getLogger(__name__)


class AssignmentListView(APIView):
    """
    GET /api/dashboard/assignments/

    Returns list of active assignments, quizzes, and practice sets.
    """

    @extend_schema(
        summary="List Assignments and Quizzes",
        description="Returns list of academic tasks and quizzes.",
        tags=["dashboard"],
        responses={200: AssignmentSerializer(many=True)},
    )
    def get(self, request):
        try:
            assignments = get_assignments()
            serializer = AssignmentSerializer(assignments, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.exception(f"[AssignmentListView] Failed to fetch assignments: {e}")
            return Response(
                {"error": "Failed to fetch assignments", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
