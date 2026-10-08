"""
apps/dashboard/services/__init__.py
"""
from apps.dashboard.services.search_service import perform_global_search
from apps.dashboard.services.dashboard_service import (
    get_registered_courses,
    create_registered_course,
    get_live_classes,
    get_assignments,
    get_dashboard_overview,
)

__all__ = [
    "perform_global_search",
    "get_registered_courses",
    "create_registered_course",
    "get_live_classes",
    "get_assignments",
    "get_dashboard_overview",
    "attendance_report",
    "attendance_csv",
    "join_session",
    "add_timetable_slot",
]

from .attendance_report_service import attendance_report, attendance_csv
from .session_join_service import join_session
from .manual_timetable_service import add_timetable_slot
