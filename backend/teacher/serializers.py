"""
Serializers for the teacher API.
"""
from rest_framework import serializers


class AskRequestSerializer(serializers.Serializer):
    question = serializers.CharField(
        required=True,
        min_length=2,
        max_length=2000,
        help_text="The student's physics question or response.",
    )
    session_id = serializers.CharField(
        required=False,
        default="default",
        max_length=128,
        help_text="Session ID for conversation continuity.",
    )
    max_new_tokens = serializers.IntegerField(
        required=False,
        default=1024,
        min_value=100,
        max_value=4096,
        help_text="Maximum tokens to generate.",
    )
    temperature = serializers.FloatField(
        required=False,
        default=0.7,
        min_value=0.1,
        max_value=1.5,
        help_text="Sampling temperature (0.1 = focused, 1.5 = creative).",
    )
    top_p = serializers.FloatField(
        required=False,
        default=0.9,
        min_value=0.1,
        max_value=1.0,
        help_text="Nucleus sampling probability.",
    )
    top_k = serializers.IntegerField(
        required=False,
        default=50,
        min_value=1,
        max_value=100,
        help_text="Top-K sampling.",
    )
    repetition_penalty = serializers.FloatField(
        required=False,
        default=1.2,
        min_value=1.0,
        max_value=2.0,
        help_text="Repetition penalty.",
    )


class AskResponseSerializer(serializers.Serializer):
    question = serializers.CharField()
    answer = serializers.CharField()
    tokens_used = serializers.IntegerField()
    model_info = serializers.DictField()
