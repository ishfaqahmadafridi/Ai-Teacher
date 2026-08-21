"""
apps/dashboard/views/__init__.py
"""
from apps.dashboard.views.search_view import SearchView
from apps.dashboard.views.overview_view import DashboardOverviewView
from apps.dashboard.views.course_view import CourseListView
from apps.dashboard.views.live_class_view import LiveClassListView
from apps.dashboard.views.assignment_view import AssignmentListView

__all__ = [
    "SearchView",
    "DashboardOverviewView",
    "CourseListView",
    "LiveClassListView",
    "AssignmentListView",
]
