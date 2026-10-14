"""Small staff-only operational snapshot; never expose questions or answers."""
from django.db.models import Count, Min
from django.utils import timezone
from apps.classroom.models.lesson_job import LessonJob, LessonQueueGate


def lesson_queue_metrics():
    counts = {row['status']: row['total'] for row in LessonJob.objects.values('status').annotate(total=Count('id'))}
    oldest = LessonJob.objects.filter(status='queued').aggregate(created=Min('created_at'))['created']
    gate = LessonQueueGate.objects.filter(pk=1).first()
    return {'counts': counts, 'oldest_wait_seconds': max(0, (timezone.now() - oldest).total_seconds()) if oldest else 0,
            'breaker_open': bool(gate and gate.breaker_until and gate.breaker_until > timezone.now())}
