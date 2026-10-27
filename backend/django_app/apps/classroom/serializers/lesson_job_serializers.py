"""Validated private job submission and polling contracts."""
from rest_framework import serializers
from .ask_serializers import AskRequestSerializer


class LessonJobRequestSerializer(AskRequestSerializer):
    scheduled_session_id = serializers.UUIDField(required=False)
    request_id = serializers.UUIDField()


class LessonJobSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    status = serializers.ChoiceField(choices=['queued', 'processing', 'ready', 'failed'])
    result = serializers.DictField()
    error = serializers.CharField(allow_blank=True)
    created_at = serializers.DateTimeField()
    updated_at = serializers.DateTimeField()


class LessonQueueMetricsSerializer(serializers.Serializer):
    counts = serializers.DictField(child=serializers.IntegerField())
    oldest_wait_seconds = serializers.FloatField()
    breaker_open = serializers.BooleanField()
