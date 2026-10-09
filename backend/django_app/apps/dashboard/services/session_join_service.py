"""Serialize admission against finalization and persist an owned, time-checked join."""
from django.contrib.auth import get_user_model
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.exceptions import APIException, NotFound
from ..models import SavedTimetable, SessionAttendance
from .session_attendance import session_window
from .attendance_reconciliation import snapshot_occurrence


class SessionUnavailable(APIException):
    status_code = 409


def join_session(user, session_id):
    with transaction.atomic():
        get_user_model().objects.select_for_update().get(pk=user.pk)
        saved = get_object_or_404(SavedTimetable.objects.select_for_update(), user=user)
        item = next((item for item in saved.schedule if item['id'] == str(session_id)), None)
        if item is None:
            raise NotFound('Session not found.')
        now = timezone.now()
        start, end = session_window(item, user.timezone, now)
        if not start <= now < end or item.get('status') == 'completed':
            raise SessionUnavailable('Join is available only during the scheduled class time.')
        snapshot_occurrence(user, item, start, end)
        attendance, _ = SessionAttendance.objects.get_or_create(
            user=user, session_id=session_id, session_date=start.date(),
            defaults={'status': 'attended', 'joined_at': now},
        )
    return {'sessionId': str(session_id), 'sessionDate': attendance.session_date.isoformat(), 'attendance': attendance.status}
