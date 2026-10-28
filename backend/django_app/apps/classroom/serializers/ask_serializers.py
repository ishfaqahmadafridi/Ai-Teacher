"""
apps/classroom/serializers/ask_serializers.py

Request and response serializers for the Ask/Classroom endpoint.
"""
import math
from rest_framework import serializers
from apps.classroom.constants.lesson import (
    LESSON_TEXT_MAX_LENGTH,
)
from .session_fields import PublicSessionIdField
from apps.classroom.constants import DEFAULT_SESSION_ID, DEFAULT_TEMPERATURE


class AskRequestSerializer(serializers.Serializer):
    """
    Validates student question request payload.
    Only fields actually consumed by the LLM pipeline are included.
    """
    research = serializers.BooleanField(required=False, default=False)

    question = serializers.CharField(
        required=True,
        min_length=2,
        max_length=LESSON_TEXT_MAX_LENGTH,
        help_text="The student's question for the AI professor.",
    )
    session_id = PublicSessionIdField(
        required=False,
        default=DEFAULT_SESSION_ID,
        max_length=128,
        help_text="Session ID for multi-turn conversation continuity.",
    )
    temperature = serializers.FloatField(
        required=False,
        default=DEFAULT_TEMPERATURE,
        min_value=0.1,
        max_value=1.5,
        help_text="LLM sampling temperature: 0.1 = focused, 1.5 = creative.",
    )

    def validate_temperature(self, value):
        if not math.isfinite(value):
            raise serializers.ValidationError("Temperature must be finite.")
        return value


class ClearSessionRequestSerializer(serializers.Serializer):
    session_id = PublicSessionIdField(default=DEFAULT_SESSION_ID, max_length=128)


class ClearSessionResponseSerializer(serializers.Serializer):
    status = serializers.CharField()
    session_id = PublicSessionIdField()
