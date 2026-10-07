"""
apps/dashboard/models/dashboard_models.py

Database models for courses, assignments, and live classes within the Dashboard domain.
"""

from django.db import models
from django.conf import settings


class CourseModel(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    """Domain model representing a registered course."""
    title = models.CharField(max_length=255, db_index=True)
    subject_field = models.CharField(max_length=100, db_index=True)
    course_code = models.CharField(max_length=50, db_index=True)
    credit_hours = models.IntegerField(default=3)
    progress_percent = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [models.UniqueConstraint(fields=["user", "course_code"], name="unique_user_course_code")]

    def __str__(self):
        return f"{self.course_code} - {self.title}"


class AssignmentModel(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    """Domain model representing an assignment or quiz."""
    ASSIGNMENT_TYPES = (
        ("assignment", "Assignment"),
        ("quiz", "Quiz"),
        ("practice_set", "Practice Set"),
    )
    title = models.CharField(max_length=255, db_index=True)
    subject = models.CharField(max_length=100, db_index=True)
    due_date = models.CharField(max_length=100)
    assignment_type = models.CharField(max_length=20, choices=ASSIGNMENT_TYPES, default="assignment")
    points = models.IntegerField(default=100)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.title


class LiveClassModel(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    """Domain model representing a live or scheduled workshop."""
    title = models.CharField(max_length=255, db_index=True)
    subject = models.CharField(max_length=100, db_index=True)
    instructor_name = models.CharField(max_length=100, db_index=True)
    time_formatted = models.CharField(max_length=100)
    is_live = models.BooleanField(default=False)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.title
