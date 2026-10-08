"""Queue task orchestration with durable recovery and isolated attendance maintenance."""
import logging
from datetime import timedelta
from uuid import uuid4
from django.db.models import Q
from celery import shared_task
from django.conf import settings
from django.db import transaction
from django.utils import timezone
from .models import TimetableJob
from .services.planning_failures import failure_update
from .services.planning_rate_limit import planning_delay
from .services.timetable_planner import plan_sessions
from .services.timetable_scheduler import schedule_sessions
logger = logging.getLogger(__name__)


@shared_task(rate_limit=settings.TIMETABLE_WORKER_RATE, acks_late=True, reject_on_worker_lost=True)
def generate_timetable(job_id):
    token = uuid4()
    with transaction.atomic():
        job = TimetableJob.objects.select_for_update().get(pk=job_id)
        if job.status != "queued" or (job.next_attempt_at and job.next_attempt_at > timezone.now()):
            return
        # The durable queued row is picked up again by the dispatcher if admission is delayed.
        try:
            delay = planning_delay()
        except Exception:
            logger.exception("Provider admission unavailable for job %s", job_id)
            return
        if delay:
            job.next_attempt_at = timezone.now() + timedelta(seconds=delay)
            job.save(update_fields=["next_attempt_at", "updated_at"])
            return
        job.status, job.run_token = "processing", token
        job.attempts += 1
        job.save(update_fields=["status", "run_token", "attempts", "updated_at"])
        inputs = job.inputs
    current = TimetableJob.objects.filter(pk=job_id, status="processing", run_token=token)
    try:
        result = schedule_sessions(inputs, plan_sessions(inputs))
    except Exception as error:
        logger.exception("Timetable generation failed for job %s", job_id)
        current.update(**failure_update(error, job.attempts))
    else:
        current.update(updated_at=timezone.now(), status="ready", result=result, error="")


@shared_task
def dispatch_timetable_jobs():
    cutoff = timezone.now() - timedelta(seconds=settings.TIMETABLE_JOB_TIMEOUT_SECONDS)
    TimetableJob.objects.filter(status="processing", updated_at__lt=cutoff).update(status="failed", error="Planning timed out. Please retry.")
    eligible = timezone.now() - timedelta(seconds=settings.TIMETABLE_DISPATCH_SECONDS)
    for job_id in TimetableJob.objects.filter(Q(next_attempt_at__isnull=True) | Q(next_attempt_at__lte=timezone.now()), status="queued", updated_at__lt=eligible).values_list("pk", flat=True).iterator():
        generate_timetable.delay(str(job_id))
        TimetableJob.objects.filter(pk=job_id, status="queued").update(updated_at=timezone.now())


@shared_task
def reconcile_attendance():
    from .models import SavedTimetable
    from .services.attendance_reconciliation import reconcile_timetable
    due = SavedTimetable.objects.exclude(schedule=[]).filter(
        Q(next_reconciliation_at__isnull=True) | Q(next_reconciliation_at__lte=timezone.now())
    )
    for saved_id in due.values_list("pk", flat=True).iterator():
        try:
            reconcile_timetable(saved_id)
        except SavedTimetable.DoesNotExist:
            continue
        except Exception:
            logger.exception("Attendance reconciliation failed for timetable %s", saved_id)
