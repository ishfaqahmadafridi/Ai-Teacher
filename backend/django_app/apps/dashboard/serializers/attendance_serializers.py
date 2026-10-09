"""Response contracts for persisted attendance, join confirmation and aggregates."""
from rest_framework import serializers


class AttendanceLogSerializer(serializers.Serializer):
    id = serializers.CharField()
    dateFormatted = serializers.DateField()
    className = serializers.CharField(allow_blank=True)
    subject = serializers.CharField(allow_blank=True)
    status = serializers.ChoiceField(choices=["present", "absent"])


class AttendanceSummarySerializer(serializers.Serializer):
    total = serializers.IntegerField(min_value=0)
    attended = serializers.IntegerField(min_value=0)
    missed = serializers.IntegerField(min_value=0)
    rate = serializers.IntegerField(min_value=0, max_value=100, allow_null=True)


class AttendanceReportSerializer(serializers.Serializer):
    attendanceLogs = AttendanceLogSerializer(many=True)
    recentMissed = AttendanceLogSerializer(many=True)
    summary = AttendanceSummarySerializer()


class SessionJoinSerializer(serializers.Serializer):
    sessionId = serializers.UUIDField()
    sessionDate = serializers.DateField()
    attendance = serializers.ChoiceField(choices=["attended"])
