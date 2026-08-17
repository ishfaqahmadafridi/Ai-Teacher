"""
URL configuration for the teacher app.
"""
from django.urls import path
from teacher.views import AskView, ClearSessionView, HealthView

urlpatterns = [
    path("ask/", AskView.as_view(), name="teacher-ask"),
    path("clear/", ClearSessionView.as_view(), name="teacher-clear"),
    path("health/", HealthView.as_view(), name="teacher-health"),
]
