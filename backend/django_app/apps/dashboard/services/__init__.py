"""
apps/dashboard/services/__init__.py
"""
from apps.dashboard.services.search_service import perform_global_search
from apps.dashboard.services.dashboard_service import (
    get_registered_courses,
    create_registered_course,
    get_live_classes,
    create_live_class,
    get_assignments,
    get_dashboard_overview,
    ensure_initial_seeds,
)

__all__ = [
    "perform_global_search",
    "get_registered_courses",
    "create_registered_course",
    "get_live_classes",
    "create_live_class",
    "get_assignments",
    "get_dashboard_overview",
    "ensure_initial_seeds",
]

