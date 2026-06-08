# physics_teacher/urls.py
# URL routing for the physics_teacher Django app.
# Registers the /explain/ and /health/ endpoints under the /api/physics-teacher/ prefix.
# The prefix is defined in config/urls.py — this file only defines the suffix paths.

from django.urls import path
from physics_teacher.views import ExplainView, HealthView

# All paths here are relative to the prefix set in config/urls.py
# Full URLs will be: /api/physics-teacher/explain/ and /api/physics-teacher/health/
urlpatterns = [
    # POST — student sends a question, receives full teaching phases JSON
    path("explain/", ExplainView.as_view(), name="physics_teacher_explain"),

    # GET — frontend checks if the backend and Gemini are ready
    path("health/", HealthView.as_view(), name="physics_teacher_health"),
]
