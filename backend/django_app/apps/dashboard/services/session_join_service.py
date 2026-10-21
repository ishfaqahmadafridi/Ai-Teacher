"""Serialize admission against finalization and persist an owned, time-checked join."""
from datetime import timedelta
from django.contrib.auth import get_user_model
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.exceptions import APIException, NotFound
from ..models import SavedTimetable, SessionAttendance
from ..constants.session_access_constants import JOIN_EARLY_MINUTES, JOIN_LATE_MINUTES
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
        opens_at = start - timedelta(minutes=JOIN_EARLY_MINUTES)
        closes_at = min(start + timedelta(minutes=JOIN_LATE_MINUTES), end)
        if now >= end or item.get('status') == 'completed':
            raise SessionUnavailable('This session has ended.')
        if now > closes_at:
            raise SessionUnavailable('Sorry, you are late. Entry closes 10 minutes after the class starts.')
        if now < opens_at:
            raise SessionUnavailable('Join opens 3 minutes before the scheduled class start.')
        snapshot_occurrence(user, item, start, end)
        attendance, _ = SessionAttendance.objects.get_or_create(
            user=user, session_id=session_id, session_date=start.date(),
            defaults={'status': 'attended', 'joined_at': now},
        )
    lesson_topic = item.get('title', '')
    if item.get('subtopics'):
        lesson_topic += '. Cover these subtopics: ' + '; '.join(item['subtopics'])
    if item.get('exercises'):
        lesson_topic += '. Include guided practice: ' + '; '.join(item['exercises'])
    return {'sessionId': str(session_id), 'sessionDate': attendance.session_date.isoformat(), 'attendance': attendance.status, 'lessonTopic': lesson_topic, 'courseTitle': item.get('subject', '')}
