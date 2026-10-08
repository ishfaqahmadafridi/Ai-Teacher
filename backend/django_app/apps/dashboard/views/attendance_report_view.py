"""Authenticated attendance report routes; logic and queries belong to services."""
from django.http import StreamingHttpResponse
from drf_spectacular.utils import extend_schema, OpenApiTypes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from ..serializers.attendance_serializers import AttendanceReportSerializer
from ..services.attendance_report_service import attendance_report, attendance_csv


class AttendanceReportView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(summary="Read completed class attendance", tags=["dashboard"], responses=AttendanceReportSerializer)
    def get(self, request):
        return Response(AttendanceReportSerializer(attendance_report(request.user)).data)


class AttendanceExportView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(summary="Export completed attendance as CSV", tags=["dashboard"], responses={(200, "text/csv"): OpenApiTypes.STR})
    def get(self, request):
        response = StreamingHttpResponse(attendance_csv(request.user), content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="attendance.csv"'
        return response
