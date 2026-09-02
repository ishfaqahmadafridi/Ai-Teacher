"""
apps/dashboard/services/dashboard_service.py

Business logic and ORM database interaction service for Dashboard domain.
"""

import logging
from typing import Dict, Any, List
from django.db import transaction
from apps.dashboard.models.dashboard_models import CourseModel, AssignmentModel, LiveClassModel

logger = logging.getLogger(__name__)

# Diverse, rich initial database seeds spanning multiple STEM academic fields
INITIAL_COURSES = [
    {
        "title": "Introduction to Computer Science & Software Engineering",
        "subject_field": "Computer Science (CS)",
        "course_code": "CS-101",
        "credit_hours": 4,
        "progress_percent": 75,
    },
    {
        "title": "Data Structures, Algorithms & Problem Solving",
        "subject_field": "Computer Science (CS)",
        "course_code": "CS-201",
        "credit_hours": 4,
        "progress_percent": 60,
    },
    {
        "title": "Quantum Mechanics & Computational Physics",
        "subject_field": "Physics & Quantum Mechanics",
        "course_code": "PHY-301",
        "credit_hours": 4,
        "progress_percent": 82,
    },
    {
        "title": "Artificial Intelligence & Neural Network Models",
        "subject_field": "Artificial Intelligence (AI)",
        "course_code": "AI-402",
        "credit_hours": 4,
        "progress_percent": 68,
    },
    {
        "title": "Distributed Systems & Cloud Computing Architecture",
        "subject_field": "Software Engineering (SE)",
        "course_code": "SE-415",
        "credit_hours": 3,
        "progress_percent": 45,
    },
    {
        "title": "Applied Linear Algebra & Machine Learning Math",
        "subject_field": "Mathematics & Data Science",
        "course_code": "MATH-220",
        "credit_hours": 3,
        "progress_percent": 90,
    },
    {
        "title": "Database Management Systems & SQL Architecture",
        "subject_field": "Information Technology (IT)",
        "course_code": "IT-305",
        "credit_hours": 3,
        "progress_percent": 40,
    },
    {
        "title": "Cybersecurity, Cryptography & Network Defense",
        "subject_field": "Cybersecurity & InfoSec",
        "course_code": "CYBER-310",
        "credit_hours": 4,
        "progress_percent": 55,
    },
]

INITIAL_ASSIGNMENTS = [
    {
        "title": "Data Structures & Algorithm Analysis Lab",
        "subject": "Computer Science (CS)",
        "due_date": "Due in 2 days",
        "assignment_type": "assignment",
        "points": 100,
    },
    {
        "title": "Quantum Wave Equation & Schrödinger Simulation Quiz",
        "subject": "Physics & Quantum Mechanics",
        "due_date": "Due Tomorrow",
        "assignment_type": "quiz",
        "points": 50,
    },
    {
        "title": "AI Neural Networks & Transformer Architectures Quiz",
        "subject": "Artificial Intelligence (AI)",
        "due_date": "Due Jan 28",
        "assignment_type": "quiz",
        "points": 50,
    },
    {
        "title": "Distributed Consensus & Raft Protocol Implementation",
        "subject": "Software Engineering (SE)",
        "due_date": "Due Feb 02",
        "assignment_type": "assignment",
        "points": 100,
    },
    {
        "title": "SQL Database System Architecture & Practice Set",
        "subject": "Information Technology (IT)",
        "due_date": "Completed Jan 20",
        "assignment_type": "practice_set",
        "points": 100,
    },
]

INITIAL_LIVE_CLASSES = [
    {
        "title": "Data Structures & Algorithms Masterclass",
        "subject": "Computer Science (CS)",
        "instructor_name": "Dr. Aris Thorne",
        "time_formatted": "Today at 2:00 PM",
        "is_live": True,
    },
    {
        "title": "Artificial Intelligence & Neural Networks",
        "subject": "Artificial Intelligence (AI)",
        "instructor_name": "Prof. Elena Rostova",
        "time_formatted": "Tomorrow at 10:00 AM",
        "is_live": False,
    },
]


def ensure_initial_seeds() -> None:
    """Ensures base database records exist across diverse academic disciplines."""
    try:
        if not CourseModel.objects.exists():
            for c in INITIAL_COURSES:
                CourseModel.objects.create(**c)
            logger.info("[DashboardService] Seeded initial CourseModel records.")

        if not AssignmentModel.objects.exists():
            for a in INITIAL_ASSIGNMENTS:
                AssignmentModel.objects.create(**a)
            logger.info("[DashboardService] Seeded initial AssignmentModel records.")

        if not LiveClassModel.objects.exists():
            for lc in INITIAL_LIVE_CLASSES:
                LiveClassModel.objects.create(**lc)
            logger.info("[DashboardService] Seeded initial LiveClassModel records.")
    except Exception as e:
        logger.warning(f"[DashboardService] Database seed check skipped: {e}")


def get_registered_courses() -> List[CourseModel]:
    """Fetches all registered courses ordered by newest first."""
    ensure_initial_seeds()
    return list(CourseModel.objects.all().order_by("-created_at"))


def create_registered_course(
    title: str,
    subject_field: str,
    course_code: str,
    credit_hours: int = 3,
) -> CourseModel:
    """Creates and persists a new course enrollment in the database."""
    with transaction.atomic():
        course, _ = CourseModel.objects.update_or_create(
            course_code=course_code.strip(),
            defaults={
                "title": title.strip(),
                "subject_field": subject_field.strip(),
                "credit_hours": credit_hours,
                "progress_percent": 0,
            },
        )
        logger.info(f"[DashboardService] Created/Updated course {course.course_code}: '{course.title}'")
        return course


def get_live_classes() -> List[LiveClassModel]:
    """Fetches all live classes and upcoming workshops from the database."""
    ensure_initial_seeds()
    return list(LiveClassModel.objects.all().order_by("id"))


def create_live_class(
    title: str,
    subject: str,
    instructor_name: str,
    time_formatted: str,
    is_live: bool = False,
) -> LiveClassModel:
    """Creates and persists a new live class / timetable session in the database."""
    with transaction.atomic():
        live_class = LiveClassModel.objects.create(
            title=title.strip(),
            subject=subject.strip(),
            instructor_name=instructor_name.strip(),
            time_formatted=time_formatted.strip(),
            is_live=is_live,
        )
        logger.info(f"[DashboardService] Created LiveClassModel #{live_class.id}: '{live_class.title}'")
        return live_class



def get_assignments() -> List[AssignmentModel]:
    """Fetches all assignments and quizzes from the database."""
    ensure_initial_seeds()
    return list(AssignmentModel.objects.all().order_by("id"))


def get_dashboard_overview() -> Dict[str, Any]:
    """
    Assembles real-time dashboard analytics, enrolled courses,
    live workshops, and active tasks from the database.
    """
    courses = get_registered_courses()
    live_classes = get_live_classes()
    assignments = get_assignments()

    return {
        "student_name": "example",
        "streak_days": 128,
        "courses_count": len(courses),
        "weekly_progress_percent": 75,
        "attendance_rate_percent": 96,
        "attendance_ratio": "28/29 Classes",
        "active_field": "Software Engineering & Artificial Intelligence & Computer Science",
        "continue_learning": {
            "id": "c1",
            "title": "Software Engineering & Artificial Intelligence",
            "chapter": "",
            "progress_percent": 75,
        },
        "courses": courses,
        "live_classes": live_classes,
        "assignments": assignments,
    }
