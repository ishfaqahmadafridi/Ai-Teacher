"""CourseModel: persistent dashboard domain model."""
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
    outline_topics = models.JSONField(default=list, blank=True)
    outline_details = models.JSONField(default=list, blank=True)
    outline_source = models.CharField(max_length=10, blank=True, default="", choices=[("manual", "Manual"), ("ai", "AI assisted")])
    outline_updated_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [models.UniqueConstraint(fields=["user", "course_code"], name="unique_user_course_code")]

    def __str__(self):
        return f"{self.course_code} - {self.title}"

