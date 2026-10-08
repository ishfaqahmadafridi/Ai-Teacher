from django.contrib.auth import get_user_model
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.dashboard.models import SavedTimetable, SessionAttendance
from apps.dashboard.services.session_attendance import session_window


class SessionJoinView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id):
        with transaction.atomic():
            get_user_model().objects.select_for_update().get(pk=request.user.pk)
            saved = get_object_or_404(SavedTimetable, user=request.user)
            item = next((item for item in saved.schedule if item["id"] == str(session_id)), None)
            if item is None:
                return Response({"detail": "Session not found."}, status=404)
            now = timezone.now()
            start, end = session_window(item, request.user.timezone, now)
            if not start <= now < end or item.get("status") == "completed":
                return Response({"detail": "Join is available only during the scheduled class time."}, status=409)
            attendance, _ = SessionAttendance.objects.get_or_create(user=request.user, session_id=session_id, session_date=start.date(), defaults={"status": "attended", "joined_at": now})
        return Response({"sessionId": str(session_id), "sessionDate": attendance.session_date.isoformat(), "attendance": "attended"})
