"""
apps/classroom/serializers/ask_serializers.py

Request and response serializers for the Ask/Classroom endpoint.
"""
import math
from rest_framework import serializers
from apps.classroom.constants import DEFAULT_SESSION_ID, DEFAULT_TEMPERATURE


class AskRequestSerializer(serializers.Serializer):
    """
    Validates student question request payload.
    Only fields actually consumed by the LLM pipeline are included.
    """
    question = serializers.CharField(
        required=True,
        min_length=2,
        max_length=2000,
        help_text="The student's question for the AI professor.",
    )
    session_id = serializers.CharField(
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
    session_id = serializers.CharField(default=DEFAULT_SESSION_ID, max_length=128)


class ClearSessionResponseSerializer(serializers.Serializer):
    status = serializers.CharField()
    session_id = serializers.CharField()


class AnswerChunkSerializer(serializers.Serializer):
    speak = serializers.CharField()
    diagram = serializers.DictField()
    key_point = serializers.CharField(required=False, allow_blank=True)
    teacher_position = serializers.ChoiceField(
        choices=("left", "center", "right"), required=False
    )


class GeneratedAnswerSerializer(serializers.Serializer):
    chunks = AnswerChunkSerializer(many=True, allow_empty=False)
    topic = serializers.CharField(default="physics")
    diagram_type = serializers.CharField(default="default")
    language = serializers.CharField(default="en")


class AskResponseSerializer(serializers.Serializer):
    """
    Documents the structured AI professor response envelope.
    """
    chunks = serializers.ListField(
        child=AnswerChunkSerializer(),
        help_text="Array of spoken sentence chunks with diagram actions.",
    )
    topic = serializers.CharField(
        help_text="One-word topic label (e.g. 'gravity', 'wave').",
    )
    diagram_type = serializers.CharField(
        help_text="Diagram type used in the frontend visualisation.",
    )
    language = serializers.CharField(
        help_text="Detected response language code (e.g. 'en', 'ur').",
    )
    tokens_used = serializers.IntegerField(
        help_text="Approximate number of tokens in the LLM response.",
    )
    model_info = serializers.DictField(
        help_text="Metadata about the model and RAG pipeline used.",
    )
