"""
apps/dashboard/serializers/dashboard_serializers.py

DRF serializers for Courses, Live Classes, Assignments, and Dashboard Overview stats.
"""

from rest_framework import serializers
from apps.dashboard.models.dashboard_models import CourseModel, AssignmentModel, LiveClassModel


class CourseModelSerializer(serializers.ModelSerializer):
    """Serializer for full Course domain model representation."""
    class Meta:
        model = CourseModel
        fields = [
            "id",
            "title",
            "subject_field",
            "course_code",
            "credit_hours",
            "progress_percent",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class CourseRegistrationRequestSerializer(serializers.Serializer):
    """Serializer validating incoming course enrollment requests."""
    title = serializers.CharField(max_length=255, required=True)
    subject_field = serializers.CharField(max_length=100, required=True)
    course_code = serializers.CharField(max_length=50, required=True)
    credit_hours = serializers.IntegerField(default=3, min_value=1, max_value=12)


class AssignmentSerializer(serializers.ModelSerializer):
    """Serializer for Assignment and Quiz items."""
    class Meta:
        model = AssignmentModel
        fields = [
            "id",
            "title",
            "subject",
            "due_date",
            "assignment_type",
            "points",
        ]
        read_only_fields = ["id"]


class LiveClassSerializer(serializers.ModelSerializer):
    """Serializer for Live Class items."""
    class Meta:
        model = LiveClassModel
        fields = [
            "id",
            "title",
            "subject",
            "instructor_name",
            "time_formatted",
            "is_live",
        ]
        read_only_fields = ["id"]


class LiveClassCreateRequestSerializer(serializers.Serializer):
    """Serializer validating incoming live class or timetable slot creation."""
    title = serializers.CharField(max_length=255, required=True)
    subject = serializers.CharField(max_length=100, required=True)
    instructor_name = serializers.CharField(max_length=100, required=True)
    time_formatted = serializers.CharField(max_length=100, required=True)
    is_live = serializers.BooleanField(default=False)



class ContinueLearningSerializer(serializers.Serializer):
    """Serializer for active continue learning card."""
    id = serializers.CharField(default="c1")
    title = serializers.CharField(default="Software Engineering & Artificial Intelligence")
    chapter = serializers.CharField(allow_blank=True, default="")
    progress_percent = serializers.IntegerField(default=75)


class DashboardOverviewSerializer(serializers.Serializer):
    """Composite serializer summarizing total student stats, active field, and enrolled courses."""
    student_name = serializers.CharField(default="example")
    streak_days = serializers.IntegerField(default=128)
    courses_count = serializers.IntegerField(default=12)
    weekly_progress_percent = serializers.IntegerField(default=75)
    attendance_rate_percent = serializers.IntegerField(default=96)
    attendance_ratio = serializers.CharField(default="28/29 Classes")
    active_field = serializers.CharField(default="Software Engineering & Artificial Intelligence & Computer Science")
    continue_learning = ContinueLearningSerializer()
    courses = CourseModelSerializer(many=True)
    live_classes = LiveClassSerializer(many=True)
    assignments = AssignmentSerializer(many=True)
