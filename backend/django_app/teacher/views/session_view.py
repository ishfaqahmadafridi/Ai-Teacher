"""
API View for session management.
"""
import logging

from rest_framework.views import APIView
from rest_framework.response import Response

from teacher.inference import clear_session

logger = logging.getLogger(__name__)


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
