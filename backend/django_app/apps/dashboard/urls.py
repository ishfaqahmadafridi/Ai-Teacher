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

app_name = "dashboard"

urlpatterns = [
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
