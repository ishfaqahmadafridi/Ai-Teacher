"""Durable student responses; evaluation remains separate from submission."""
import uuid
from django.db import models
from .lecture_notes import LectureNote


class LessonAttempt(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    note = models.ForeignKey(LectureNote, on_delete=models.CASCADE, related_name='attempts')
    evaluation = models.JSONField(default=dict)
    evaluating_since = models.DateTimeField(null=True)
    request_id = models.UUIDField()
    section_index = models.PositiveIntegerField()
    question = models.TextField()
    answer = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['note', 'request_id'], name='unique_lesson_answer_request')]


class LessonProgress(models.Model):
    note = models.OneToOneField(LectureNote, on_delete=models.CASCADE, related_name='progress')
    section_index = models.PositiveIntegerField(default=0)
    waiting = models.BooleanField(default=False)
    revision = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)
