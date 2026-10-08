"""
apps/dashboard/urls.py

URL routing configuration for the Dashboard feature app.
"""
from django.urls import path
from apps.dashboard.views import (
    SearchView,
    DashboardOverviewView,
    CourseListView,
    LiveClassListView,
    AssignmentListView,
)

from .views.timetable_view import TimetableGenerateView, TimetableJobView, SavedTimetableView

from .views.session_attendance_view import SessionJoinView

app_name = "dashboard"

urlpatterns = [
    path("dashboard/timetable/sessions/<uuid:session_id>/join/", SessionJoinView.as_view()),
    path("dashboard/timetable/generate/", TimetableGenerateView.as_view()),
    path("dashboard/timetable/jobs/<uuid:job_id>/", TimetableJobView.as_view()),
    path("dashboard/timetable/", SavedTimetableView.as_view()),
    # ── Global Search Endpoint ────────────────────────────────────────────────
    path("search/", SearchView.as_view(), name="dashboard-search"),

    # ── Canonical Dashboard API Endpoints (/api/dashboard/...) ────────────────
    path("dashboard/overview/", DashboardOverviewView.as_view(), name="dashboard-overview"),
    path("dashboard/courses/", CourseListView.as_view(), name="dashboard-courses"),
    path("dashboard/live-classes/", LiveClassListView.as_view(), name="dashboard-live-classes"),
    path("dashboard/assignments/", AssignmentListView.as_view(), name="dashboard-assignments"),

    # ── Direct Alias Endpoints (/api/...) ─────────────────────────────────────
    path("overview/", DashboardOverviewView.as_view(), name="overview"),
    path("courses/", CourseListView.as_view(), name="courses"),
    path("live-classes/", LiveClassListView.as_view(), name="courses-list"),
    path("assignments/", AssignmentListView.as_view(), name="assignments-list"),
]
