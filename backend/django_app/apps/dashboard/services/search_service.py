"""
apps/dashboard/services/search_service.py

Global search service for querying courses, assignments, live classes, and topics in the Dashboard app.
"""
import logging
from typing import Any, Dict, List
from django.core.cache import cache
from django.db.models import Q

from apps.dashboard.constants import (
    DEFAULT_SEARCH_COURSES,
    DEFAULT_SEARCH_ASSIGNMENTS,
    DEFAULT_SEARCH_LIVE_CLASSES,
    DEFAULT_SEARCH_TOPICS,
    SEARCH_CACHE_TTL_SECONDS,
)
from apps.dashboard.models import CourseModel, AssignmentModel, LiveClassModel

logger = logging.getLogger(__name__)


def perform_global_search(query: str, limit: int = 10) -> Dict[str, Any]:
    """
    Executes high-performance global search with ORM queries and Redis/Memory Caching.
    """
    clean_query = query.strip()
    if not clean_query:
        return _build_empty_response(query)

    cache_key = f"search:v1:{clean_query.lower()}:{limit}"
    cached_result = cache.get(cache_key)
    if cached_result:
        logger.debug(f"[dashboard.search_service] Cache hit for key '{cache_key}'")
        return cached_result

    courses = _search_courses(clean_query, limit)
    assignments = _search_assignments(clean_query, limit)
    live_classes = _search_live_classes(clean_query, limit)
    topics = _search_topics(clean_query, limit)

    total_count = len(courses) + len(assignments) + len(live_classes) + len(topics)

    response_data = {
        "query": query,
        "courses": courses,
        "assignments": assignments,
        "liveClasses": live_classes,
        "topics": topics,
        "totalCount": total_count,
    }

    cache.set(cache_key, response_data, timeout=SEARCH_CACHE_TTL_SECONDS)
    return response_data


def _build_empty_response(query: str) -> Dict[str, Any]:
    return {
        "query": query,
        "courses": [],
        "assignments": [],
        "liveClasses": [],
        "topics": [],
        "totalCount": 0,
    }


def _search_courses(query: str, limit: int) -> List[Dict[str, Any]]:
    q_lower = query.lower()
    try:
        qs = CourseModel.objects.filter(
            Q(title__icontains=query)
            | Q(subject_field__icontains=query)
            | Q(course_code__icontains=query)
        )[:limit]

        if qs.exists():
            return [
                {
                    "id": str(c.id),
                    "type": "course",
                    "title": c.title,
                    "subtitle": f"{c.course_code} • {c.subject_field} ({c.progress_percent}% Complete)",
                    "badgeText": "Course",
                    "actionPayload": {"targetTab": "dashboard", "courseId": str(c.id)},
                }
                for c in qs
            ]
    except Exception as e:
        logger.debug(f"[dashboard.search_service] Course ORM query fallback: {e}")

    return [
        c for c in DEFAULT_SEARCH_COURSES
        if q_lower in c["title"].lower() or q_lower in c["subjectField"].lower() or q_lower in c["courseCode"].lower()
    ][:limit]


def _search_assignments(query: str, limit: int) -> List[Dict[str, Any]]:
    q_lower = query.lower()
    try:
        qs = AssignmentModel.objects.filter(
            Q(title__icontains=query)
            | Q(subject__icontains=query)
            | Q(assignment_type__icontains=query)
        )[:limit]

        if qs.exists():
            return [
                {
                    "id": str(a.id),
                    "type": "assignment",
                    "title": a.title,
                    "subtitle": f"{a.subject} • {a.due_date} ({a.points} pts)",
                    "badgeText": "Quiz" if a.assignment_type == "quiz" else "Assignment",
                    "actionPayload": {"targetTab": "assignments_quizzes", "taskId": str(a.id)},
                }
                for a in qs
            ]
    except Exception as e:
        logger.debug(f"[dashboard.search_service] Assignment ORM query fallback: {e}")

    return [
        a for a in DEFAULT_SEARCH_ASSIGNMENTS
        if q_lower in a["title"].lower() or q_lower in a["subject"].lower() or q_lower in a["badgeText"].lower()
    ][:limit]


def _search_live_classes(query: str, limit: int) -> List[Dict[str, Any]]:
    q_lower = query.lower()
    try:
        qs = LiveClassModel.objects.filter(
            Q(title__icontains=query)
            | Q(subject__icontains=query)
            | Q(instructor_name__icontains=query)
        )[:limit]

        if qs.exists():
            return [
                {
                    "id": str(lc.id),
                    "type": "live_class",
                    "title": lc.title,
                    "subtitle": f"{lc.subject} • {lc.instructor_name} ({lc.time_formatted})",
                    "badgeText": "LIVE NOW" if lc.is_live else "Live Class",
                    "actionPayload": {"targetTab": "schedule", "classId": str(lc.id)},
                }
                for lc in qs
            ]
    except Exception as e:
        logger.debug(f"[dashboard.search_service] LiveClass ORM query fallback: {e}")

    return [
        lc for lc in DEFAULT_SEARCH_LIVE_CLASSES
        if q_lower in lc["title"].lower() or q_lower in lc["subject"].lower() or q_lower in lc["instructor"].lower()
    ][:limit]


def _search_topics(query: str, limit: int) -> List[Dict[str, Any]]:
    q_lower = query.lower()
    return [
        t for t in DEFAULT_SEARCH_TOPICS
        if q_lower in t["title"].lower() or q_lower in t["subject"].lower()
    ][:limit]
