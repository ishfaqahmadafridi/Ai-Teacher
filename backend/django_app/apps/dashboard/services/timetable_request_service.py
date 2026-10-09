"""Owned timetable requests, persistence and queue publishing; views only route."""
from datetime import timedelta
import hashlib
import json
from django.utils import timezone
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework.exceptions import APIException, ValidationError
from ..models import CourseModel, TimetableJob, SavedTimetable
from ..tasks import generate_timetable
from ..constants.timetable_prompts import PLANNER_VERSION
from .session_attendance import schedule_with_attendance
from .attendance_reconciliation import reconcile_timetable


class TimetableConflict(APIException):
    status_code = 409


def request_timetable(user, preferences):
    with transaction.atomic():
        get_user_model().objects.select_for_update().get(pk=user.pk)
        courses = list(CourseModel.objects.filter(user=user).order_by("id").values("id", "title", "subject_field"))
        if not courses:
            raise ValidationError("Register a course before creating a timetable.")
        inputs = {"courses": courses, "preferences": preferences, "planner_version": PLANNER_VERSION}
        fingerprint = hashlib.sha256(json.dumps(inputs, sort_keys=True).encode()).hexdigest()
        TimetableJob.objects.filter(user=user, status="processing", updated_at__lt=timezone.now()-timedelta(seconds=settings.TIMETABLE_JOB_TIMEOUT_SECONDS)).update(status="failed", error="Planning timed out. Please retry.")
        pending = TimetableJob.objects.filter(user=user, status__in=["queued", "processing"]).first()
        if pending:
            return {"id": str(pending.id), "status": pending.status}
        job, created = TimetableJob.objects.get_or_create(user=user, fingerprint=fingerprint, defaults={"inputs": inputs})
        if created or job.status == "failed":
            job.status, job.error, job.attempts, job.run_token, job.next_attempt_at = "queued", "", 0, None, None
            job.save()
            def enqueue():
                try:
                    generate_timetable.delay(str(job.id))
                except Exception:
                    TimetableJob.objects.filter(pk=job.id).update(error="Waiting for the planning queue to recover.")
            transaction.on_commit(enqueue)
    return {"id": str(job.id), "status": job.status}

def read_timetable_job(user, job_id):
    job = get_object_or_404(TimetableJob, pk=job_id, user=user)
    return {"id": str(job.id), "status": job.status, "result": job.result, "error": job.error}

def accept_timetable_job(user, job_id):
    with transaction.atomic():
        get_user_model().objects.select_for_update().get(pk=user.pk)
        job = get_object_or_404(TimetableJob, pk=job_id, user=user, status="ready")
        if not set(str(course.pk) for course in CourseModel.objects.filter(user=user)).issuperset(item["courseId"] for item in job.result["schedule"]):
            raise TimetableConflict("Courses changed. Generate a new timetable.")
        previous = SavedTimetable.objects.filter(user=user).first()
        if previous:
            reconcile_timetable(previous.pk)
        saved, _ = SavedTimetable.objects.update_or_create(user=user, defaults={"next_reconciliation_at": None, "reconciled_through": None, "schedule": [{**item, "activeFrom": timezone.now().isoformat()} for item in job.result["schedule"]]})
    return {"schedule": saved.schedule}

def read_saved_timetable(user):
    saved = SavedTimetable.objects.filter(user=user).first()
    return {"schedule": schedule_with_attendance(saved, user) if saved else []}
