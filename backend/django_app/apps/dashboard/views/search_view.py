"""
apps/dashboard/views/search_view.py

API View for global dashboard search in the Dashboard app.
"""
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema, OpenApiParameter

from apps.dashboard.services import perform_global_search
from apps.dashboard.serializers import SearchGroupedResultsSerializer

logger = logging.getLogger(__name__)


class SearchView(APIView):
    """
    GET /api/search/?q=<query>

    Executes global search across courses, assignments, quizzes, live classes, and topics.
    """

    @extend_schema(
        summary="Global dashboard search",
        description=(
            "Search across all academic content: courses, assignments, quizzes, "
            "live classes, and topics. Results are cached in Redis for 5 minutes."
        ),
        tags=["dashboard"],
        parameters=[
            OpenApiParameter(
                name="q",
                type=str,
                location=OpenApiParameter.QUERY,
                required=True,
                description="Search query string (minimum 1 character).",
            ),
            OpenApiParameter(
                name="limit",
                type=int,
                location=OpenApiParameter.QUERY,
                required=False,
                description="Maximum results per category (default: 10).",
            ),
        ],
        responses={
            200: SearchGroupedResultsSerializer,
            400: {"description": "Missing or empty 'q' parameter."},
        },
    )
    def get(self, request):
        query = request.query_params.get("q", "").strip()
        if not query:
            return Response(
                {"error": "Query parameter 'q' is required and cannot be empty."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        limit_param = request.query_params.get("limit", "10")
        try:
            limit = int(limit_param)
        except ValueError:
            limit = 10

        logger.info(f"[Dashboard SearchView] Executing query='{query[:80]}' limit={limit}")

        try:
            raw_results = perform_global_search(query=query, limit=limit)
            serializer = SearchGroupedResultsSerializer(data=raw_results)
            if serializer.is_valid():
                response_data = serializer.data
            else:
                response_data = raw_results
        except Exception as e:
            logger.exception(f"[Dashboard SearchView] Unexpected error during search: {e}")
            return Response(
                {"error": "An error occurred while performing search.", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(response_data, status=status.HTTP_200_OK)
