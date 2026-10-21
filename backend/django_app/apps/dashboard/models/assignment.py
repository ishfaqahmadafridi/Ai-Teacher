"""AssignmentModel: persistent dashboard domain model."""
from django.db import models
from django.conf import settings


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

