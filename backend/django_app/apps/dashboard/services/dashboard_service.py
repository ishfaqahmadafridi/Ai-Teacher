"""Dashboard records belong to the account that explicitly created them."""
from apps.dashboard.models import CourseModel, AssignmentModel, LiveClassModel


def get_registered_courses(user=None):
    return list(CourseModel.objects.filter(user=user).order_by("-created_at")) if user and user.is_authenticated else []


def create_registered_course(title, subject_field, course_code, credit_hours=3, user=None):
    if not user or not user.is_authenticated:
        raise ValueError("A signed-in account is required.")
    course, _ = CourseModel.objects.get_or_create(
        user=user, course_code=course_code.strip(),
        defaults={"title": title.strip(), "subject_field": subject_field.strip(), "credit_hours": credit_hours},
    )
    return course


def get_live_classes(user=None):
    return list(LiveClassModel.objects.filter(user=user)) if user and user.is_authenticated else []


def get_assignments(user=None):
    return list(AssignmentModel.objects.filter(user=user)) if user and user.is_authenticated else []


def get_dashboard_overview(user=None):
    courses = get_registered_courses(user)
    active = next((course for course in courses if course.progress_percent < 100), None)
    return {
        "student_name": (user.get_full_name() or user.username) if user and user.is_authenticated else "",
        "streak_days": 0, "courses_count": len(courses),
        "weekly_progress_percent": 0, "attendance_rate_percent": 0,
        "attendance_ratio": "0/0 Classes",
        "active_field": ", ".join(user.selected_interests) if user and user.is_authenticated else "",
        "continue_learning": {"id": str(active.id), "title": active.title, "chapter": "", "progress_percent": active.progress_percent} if active else None,
        "courses": courses, "live_classes": get_live_classes(user), "assignments": get_assignments(user),
    }
