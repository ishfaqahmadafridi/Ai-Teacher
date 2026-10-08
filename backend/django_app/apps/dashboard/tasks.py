import logging
from celery import shared_task
from django.conf import settings
from django.db import transaction
from django.utils import timezone
from .models import TimetableJob
from .services.timetable_planner import plan_sessions
from .services.timetable_scheduler import schedule_sessions
logger = logging.getLogger(__name__)

@shared_task(rate_limit=settings.TIMETABLE_WORKER_RATE)
def generate_timetable(job_id):
    with transaction.atomic():
        job = TimetableJob.objects.select_for_update().get(pk=job_id)
        if job.status != "queued":
            return
        job.status = "processing"
        job.save(update_fields=["status", "updated_at"])
        inputs = job.inputs
    try:
        result = schedule_sessions(inputs, plan_sessions(inputs))
    except Exception:
        logger.exception("Timetable generation failed for job %s", job_id)
        TimetableJob.objects.filter(pk=job_id, status="processing").update(updated_at=timezone.now(), status="failed", error="Unable to generate a valid plan. Check your availability and try again.")
    else:
        TimetableJob.objects.filter(pk=job_id, status="processing").update(updated_at=timezone.now(), status="ready", result=result, error="")
