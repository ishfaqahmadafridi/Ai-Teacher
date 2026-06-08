# physics_teacher/apps.py
# Django AppConfig for the physics_teacher application.
# Tells Django this app exists and sets its display name.

from django.apps import AppConfig


class PhysicsTeacherConfig(AppConfig):
    # Use BigAutoField as primary key type (Django 3.2+ default)
    default_auto_field = "django.db.models.BigAutoField"

    # Internal app name — must match the directory name exactly
    name = "physics_teacher"

    # Human-readable name shown in Django admin
    verbose_name = "AI Physics Teacher"
