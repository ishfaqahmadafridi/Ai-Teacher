"""Resolve trusted scheduled lesson scope for an admitted student."""
from datetime import timedelta
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied
from ..models import SavedTimetable, SessionAttendance
from ..constants.session_access_constants import JOIN_EARLY_MINUTES
from .session_attendance import session_window


def scheduled_curriculum(user, session_id):
    saved = get_object_or_404(SavedTimetable, user=user)
    item = next((item for item in saved.schedule if item['id'] == str(session_id)), None)
    if not item:
        raise PermissionDenied('This class is not in your timetable.')
    now = timezone.now()
    start, end = session_window(item, user.timezone, now)
    joined = SessionAttendance.objects.filter(user=user, session_id=session_id, session_date=start.date(), status='attended').exists()
    if not joined or not start - timedelta(minutes=JOIN_EARLY_MINUTES) <= now < end:
        raise PermissionDenied('Join your scheduled class before requesting its lesson, and submit during class time.')
    requirements = [dict(id='topic', kind='topic', label=item['title'])]
    for field, kind in [('subtopics', 'concept'), ('exercises', 'exercise')]:
        requirements.extend(dict(id=f'{kind}-{index}', kind=kind, label=value) for index, value in enumerate(item.get(field, [])))
    return dict(session_id=str(session_id), course=item.get('subject', ''), topic=item['title'],
                week=item.get('weekNumber'), session_kind=item.get('sessionKind', 'lesson'), requirements=requirements)
