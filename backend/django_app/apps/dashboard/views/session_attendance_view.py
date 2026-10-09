"""Session join routing with an explicit API response contract."""
from drf_spectacular.utils import extend_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from ..serializers.attendance_serializers import SessionJoinSerializer
from ..services.session_join_service import join_session


class SessionJoinView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(summary="Join an owned class during its scheduled time", tags=["dashboard"], request=None, responses=SessionJoinSerializer)
    def post(self, request, session_id):
        return Response(SessionJoinSerializer(join_session(request.user, session_id)).data)
