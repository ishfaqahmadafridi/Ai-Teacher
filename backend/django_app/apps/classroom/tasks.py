"""Dedicated lesson workers and a bounded database outbox recovery task."""
from datetime import timedelta
from celery import shared_task
from django.conf import settings
from django.db.models import Q, Case, When, Value, CharField
from django.utils import timezone
from apps.classroom.models.lesson_job import LessonJob
from apps.classroom.services.lesson_jobs import run_lesson_job, publish_lesson_job


@shared_task(acks_late=True, reject_on_worker_lost=True)
def prepare_lesson(job_id):
    run_lesson_job(job_id)


@shared_task(acks_late=True)
def repair_saved_visuals(note_id):
    from apps.classroom.services.visual_repair import repair_note_visuals
    return str(repair_note_visuals(note_id).id)


@shared_task
def recover_lesson_jobs():
    cutoff = timezone.now() - timedelta(seconds=settings.CLASSROOM_JOB_TIMEOUT_SECONDS)
    LessonJob.objects.filter(status='queued', created_at__lt=cutoff).update(status='failed', error='Lesson preparation timed out. Please submit again.', updated_at=timezone.now())
    LessonJob.objects.filter(status='processing', updated_at__lt=timezone.now() - timedelta(seconds=settings.CELERY_TASK_TIME_LIMIT + 30)).update(
        status=Case(When(attempts__lt=settings.CLASSROOM_JOB_MAX_ATTEMPTS, then=Value('queued')), default=Value('failed'), output_field=CharField()),
        run_token=None, next_attempt_at=timezone.now(), error='Lesson worker timed out.', updated_at=timezone.now())
    eligible = timezone.now() - timedelta(seconds=10)
    due = LessonJob.objects.filter(status='queued', updated_at__lt=eligible).filter(Q(next_attempt_at__isnull=True) | Q(next_attempt_at__lte=timezone.now())).order_by('created_at')[:settings.CLASSROOM_DISPATCH_BATCH]
    for job_id in due.values_list('pk', flat=True):
        publish_lesson_job(str(job_id))
        LessonJob.objects.filter(pk=job_id, status='queued').update(updated_at=timezone.now())
