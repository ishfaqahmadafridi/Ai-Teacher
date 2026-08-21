"""
apps/dashboard/views/course_view.py

API View for listing and registering courses within the Dashboard domain.
"""

import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema

from apps.dashboard.services import (
    get_registered_courses,
    create_registered_course,
)
from apps.dashboard.serializers import (
    CourseModelSerializer,
    CourseRegistrationRequestSerializer,
)

logger = logging.getLogger(__name__)


class CourseListView(APIView):
    """
    GET /api/dashboard/courses/
    POST /api/dashboard/courses/

    Lists all registered courses or enrolls into a new course.
    """

    @extend_schema(
        summary="List Registered Courses",
        description="Returns list of all active registered courses.",
        tags=["dashboard"],
        responses={200: CourseModelSerializer(many=True)},
    )
    def get(self, request):
        try:
            courses = get_registered_courses()
            serializer = CourseModelSerializer(courses, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.exception(f"[CourseListView] Failed to list courses: {e}")
            return Response(
                {"error": "Failed to list courses", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @extend_schema(
        summary="Register New Course",
        description="Registers and persists a new course enrollment for the student.",
        tags=["dashboard"],
        request=CourseRegistrationRequestSerializer,
        responses={201: CourseModelSerializer},
    )
    def post(self, request):
        serializer = CourseRegistrationRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated = serializer.validated_data

        try:
            course = create_registered_course(
                title=validated["title"],
                subject_field=validated["subject_field"],
                course_code=validated["course_code"],
                credit_hours=validated.get("credit_hours", 3),
            )
            response_serializer = CourseModelSerializer(course)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.exception(f"[CourseListView] Failed to register course: {e}")
            return Response(
                {"error": "Failed to register course", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
