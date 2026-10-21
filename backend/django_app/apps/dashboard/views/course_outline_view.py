"""Read/save owned course outlines and request unsaved AI drafts."""
from drf_spectacular.utils import extend_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from ..serializers.course_outline_serializers import CourseOutlineSerializer, CourseOutlineResponseSerializer
from ..services.course_outline_service import read_course_outline, save_course_outline, generate_course_outline


class CourseOutlineView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(responses=CourseOutlineResponseSerializer, tags=['dashboard'])
    def get(self, request, course_id):
        return Response(CourseOutlineResponseSerializer(read_course_outline(request.user, course_id)).data)

    @extend_schema(request=CourseOutlineSerializer, responses=CourseOutlineResponseSerializer, tags=['dashboard'])
    def put(self, request, course_id):
        serializer = CourseOutlineSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(CourseOutlineResponseSerializer(save_course_outline(request.user, course_id, serializer.validated_data)).data)


class CourseOutlineGenerateView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'course_outline'

    @extend_schema(request=None, responses=CourseOutlineResponseSerializer, tags=['dashboard'])
    def post(self, request, course_id):
        return Response(CourseOutlineResponseSerializer(generate_course_outline(request.user, course_id)).data)
