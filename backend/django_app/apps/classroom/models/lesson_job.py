"""Private durable lesson preparation jobs and serialized admission control."""
import uuid
from django.conf import settings
from django.db import models


class LessonQueueGate(models.Model):
    """One row serializes admission and claims across all API/worker processes."""
    objects = models.Manager()
    id = models.PositiveSmallIntegerField(primary_key=True, default=1)
    failures = models.PositiveIntegerField(default=0)
    breaker_until = models.DateTimeField(null=True)


class LessonJob(models.Model):
    objects = models.Manager()
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    request_id = models.UUIDField()
    flight_key = models.CharField(max_length=64, db_index=True)
    inputs = models.JSONField()
    status = models.CharField(max_length=16, default='queued', db_index=True)
    result = models.JSONField(default=dict)
    error = models.CharField(max_length=200, blank=True)
    attempts = models.PositiveIntegerField(default=0)
    run_token = models.UUIDField(null=True)
    next_attempt_at = models.DateTimeField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['user', 'request_id'], name='unique_lesson_job_request')]
        indexes = [models.Index(fields=['status', 'next_attempt_at', 'created_at'])]


class LessonJobSubmission(models.Model):
    """Every retry key stays bound to its original single-flight job."""
    objects = models.Manager()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    request_id = models.UUIDField()
    job = models.ForeignKey(LessonJob, on_delete=models.CASCADE)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['user', 'request_id'], name='unique_lesson_submission_request')]
