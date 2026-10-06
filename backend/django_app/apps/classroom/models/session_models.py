"""Persistent conversation history owned by the classroom app."""
from django.db import models


class ClassroomSession(models.Model):
    session_id = models.CharField(max_length=128, primary_key=True)
    history = models.JSONField(default=list)
    updated_at = models.DateTimeField(auto_now=True)
