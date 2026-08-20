"""
apps/dashboard/apps.py

AppConfig for the Dashboard feature app.
Manages search, course statistics, assignments, and dashboard metrics.
"""
from django.apps import AppConfig


class DashboardConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.dashboard"
    verbose_name = "Dashboard Feature Engine"
