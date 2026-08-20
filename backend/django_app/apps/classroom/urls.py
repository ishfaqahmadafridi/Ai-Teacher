"""
URL configuration for the Classroom AI feature app.
"""
from django.urls import path
from apps.classroom.views import AskView, ClearSessionView, HealthView

urlpatterns = [
    path("ask/", AskView.as_view(), name="classroom-ask"),
    path("clear/", ClearSessionView.as_view(), name="classroom-clear"),
    path("health/", HealthView.as_view(), name="classroom-health"),
]
