"""LiveClassModel: persistent dashboard domain model."""
from django.db import models
from django.conf import settings


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

