"""Detect dated previews whose first classes can no longer be accepted."""
from django.utils import timezone
from .session_attendance import session_window


def timetable_preview_expired(result, profile_timezone, now=None):
    now = now or timezone.now()
    return any(item.get('planStartDate') and session_window(item, profile_timezone, now)[0] <= now
               for item in result.get('schedule', []))
