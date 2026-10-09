"""Timetable API routing, serializer validation and documented response contracts."""
from django.conf import settings
from drf_spectacular.utils import extend_schema
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from ..serializers.timetable_serializers import (
    TimetablePreferencesSerializer, ManualSlotSerializer,
    TimetableJobResponseSerializer, SavedTimetableResponseSerializer,
)
from ..services.timetable_request_service import (
    request_timetable, read_timetable_job, accept_timetable_job,
    read_saved_timetable,
)

from ..services.manual_timetable_service import add_timetable_slot


class TimetableThrottle(UserRateThrottle):
    scope = "timetable"

    def get_rate(self):
        return settings.TIMETABLE_REQUEST_RATE


class TimetableGenerateView(APIView):
    throttle_classes = [TimetableThrottle]
    permission_classes = [IsAuthenticated]

    @extend_schema(summary="Queue an owned timetable plan", tags=["dashboard"], request=TimetablePreferencesSerializer, responses={202: TimetableJobResponseSerializer})
    def post(self, request):
        serializer = TimetablePreferencesSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = request_timetable(request.user, dict(serializer.data))
        return Response(TimetableJobResponseSerializer(result).data, status=202)


class TimetableJobView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(summary="Read an owned planning job", tags=["dashboard"], responses=TimetableJobResponseSerializer)
    def get(self, request, job_id):
        return Response(TimetableJobResponseSerializer(read_timetable_job(request.user, job_id)).data)

    @extend_schema(summary="Accept an owned timetable suggestion", tags=["dashboard"], request=None, responses=SavedTimetableResponseSerializer)
    def post(self, request, job_id):
        return Response(SavedTimetableResponseSerializer(accept_timetable_job(request.user, job_id)).data)


class SavedTimetableView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(summary="Read the saved timetable and attendance", tags=["dashboard"], responses=SavedTimetableResponseSerializer)
    def get(self, request):
        return Response(SavedTimetableResponseSerializer(read_saved_timetable(request.user)).data)

    @extend_schema(summary="Add an owned manual timetable slot", tags=["dashboard"], request=ManualSlotSerializer, responses={201: SavedTimetableResponseSerializer})
    def post(self, request):
        serializer = ManualSlotSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = add_timetable_slot(request.user, dict(serializer.data))
        return Response(SavedTimetableResponseSerializer(result).data, status=201)
