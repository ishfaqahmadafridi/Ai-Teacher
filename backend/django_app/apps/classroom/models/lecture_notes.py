"""Immutable account-owned answer snapshots and cached translated notes."""
import uuid
from django.conf import settings
from django.db import models


class LectureNote(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    session_id = models.CharField(max_length=128)
    version = models.CharField(max_length=64)
    answer = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['user', 'session_id', 'version'], name='unique_lecture_note_version')]
        indexes = [models.Index(fields=['user', 'session_id', '-created_at'])]


class NoteTranslation(models.Model):
    note = models.ForeignKey(LectureNote, on_delete=models.CASCADE, related_name='translations')
    language = models.CharField(max_length=16)
    content = models.JSONField(default=dict)
    status = models.CharField(max_length=16, default='processing')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['note', 'language'], name='unique_note_translation_language')]


class NoteFigure(models.Model):
    note = models.ForeignKey(LectureNote, on_delete=models.CASCADE, related_name='figures')
    section_index = models.PositiveIntegerField()
    image = models.FileField(upload_to='lecture-notes/figures/', max_length=255)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['note', 'section_index'], name='unique_note_section_figure')]
