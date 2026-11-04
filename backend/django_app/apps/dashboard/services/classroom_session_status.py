"""Read the admitted occurrence's server-clock window without marking attendance."""
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.exceptions import NotFound
from apps.dashboard.models import SessionAttendance, SessionOccurrence
from apps.classroom.models.lesson_job import LessonJob


def classroom_session_status(user, session_id):
    attendance = SessionAttendance.objects.filter(
        user=user, session_id=session_id, status='attended',
    ).order_by('-session_date').first()
    if attendance is None:
        raise NotFound('Join this scheduled class before opening its classroom.')
    occurrence = get_object_or_404(
        SessionOccurrence, user=user, session_id=session_id, session_date=attendance.session_date,
    )
    now = timezone.now()
    job = LessonJob.objects.filter(
        user=user, status='ready', inputs__scheduled_session_id=str(session_id),
        created_at__gte=attendance.joined_at,
    ).order_by('-created_at').first()
    return {
        'sessionId': session_id, 'startsAt': occurrence.starts_at, 'endsAt': occurrence.ends_at,
        'serverNow': now, 'courseTitle': occurrence.subject, 'lessonTitle': occurrence.title,
        'noteId': job.result.get('model_info', {}).get('note_id') if job else None,
    }
