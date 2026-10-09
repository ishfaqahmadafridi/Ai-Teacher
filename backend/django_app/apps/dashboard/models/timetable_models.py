"""Persistent planning jobs, weekly timetables, dated classes and attendance records."""
import uuid
from django.conf import settings
from django.db import models

class TimetableJob(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    fingerprint = models.CharField(max_length=64)
    run_token = models.UUIDField(null=True, blank=True)
    attempts = models.PositiveIntegerField(default=0)
    next_attempt_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=16, default="queued")
    inputs = models.JSONField()
    result = models.JSONField(default=dict)
    error = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        constraints = [models.UniqueConstraint(fields=["user", "fingerprint"], name="unique_timetable_request")]
        indexes = [models.Index(fields=["status", "next_attempt_at"], name="planning_pending_jobs")]

class SavedTimetable(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    schedule = models.JSONField(default=list)
    reconciled_through = models.DateTimeField(null=True, blank=True)
    next_reconciliation_at = models.DateTimeField(null=True, blank=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

class SessionAttendance(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    session_id = models.UUIDField()
    session_date = models.DateField()
    status = models.CharField(max_length=16, choices=[("attended", "Attended"), ("missed", "Missed")], default="attended")
    joined_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["user", "session_id", "session_date"], name="unique_session_attendance")]


class SessionOccurrence(models.Model):
    """Immutable dated snapshot; attendance survives timetable replacement."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    session_id = models.UUIDField()
    session_date = models.DateField()
    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField()
    timezone = models.CharField(max_length=64)
    title = models.CharField(max_length=255)
    subject = models.CharField(max_length=255, blank=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["user", "session_id", "session_date"], name="unique_session_occurrence")]
        indexes = [models.Index(fields=["user", "ends_at"], name="occurrence_user_end")]
