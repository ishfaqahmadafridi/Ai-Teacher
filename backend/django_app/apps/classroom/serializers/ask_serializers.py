"""
apps/classroom/serializers/ask_serializers.py

Request and response serializers for the Ask/Classroom endpoint.
"""
from rest_framework import serializers


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
        default="default",
        max_length=128,
        help_text="Session ID for multi-turn conversation continuity.",
    )
    temperature = serializers.FloatField(
        required=False,
        default=0.7,
        min_value=0.1,
        max_value=1.5,
        help_text="LLM sampling temperature: 0.1 = focused, 1.5 = creative.",
    )


class AskResponseSerializer(serializers.Serializer):
    """
    Documents the structured AI professor response envelope.
    """
    chunks = serializers.ListField(
        child=serializers.DictField(),
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
