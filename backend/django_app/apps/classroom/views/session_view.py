"""
API View for session management.
"""
import logging

from rest_framework.views import APIView
from rest_framework.response import Response

from apps.classroom.services import clear_session
from drf_spectacular.utils import extend_schema
from apps.classroom.serializers import ClearSessionRequestSerializer, ClearSessionResponseSerializer

logger = logging.getLogger(__name__)


class ClearSessionView(APIView):
    """
    POST /api/clear/

    Clears conversation memory for a given session so the student can start fresh.
    """

    @extend_schema(
        tags=["classroom"], request=ClearSessionRequestSerializer,
        responses={200: ClearSessionResponseSerializer},
    )
    def post(self, request):
        serializer = ClearSessionRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        session_id = serializer.validated_data["session_id"]
        clear_session(session_id)
        logger.info(f"[ClearSessionView] Cleared session: {session_id!r}")
        return Response(ClearSessionResponseSerializer({"status": "cleared", "session_id": session_id}).data)
