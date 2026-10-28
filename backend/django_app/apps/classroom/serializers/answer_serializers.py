"""Generated lesson and public response schemas, separate from request validation."""
from rest_framework import serializers
from apps.classroom.constants.lesson import (
    CURRICULUM_ID_MAX_LENGTH, CURRICULUM_MAX_REQUIREMENTS,
    LESSON_TEXT_MAX_LENGTH, LESSON_CONCEPT_MAX_LENGTH, LESSON_MAX_CONCEPTS,
)
from .diagram_fields import AnswerDiagramField


class AnswerChunkSerializer(serializers.Serializer):
    curriculum_ids = serializers.ListField(
        child=serializers.CharField(max_length=CURRICULUM_ID_MAX_LENGTH),
        required=False, max_length=CURRICULUM_MAX_REQUIREMENTS,
    )

    question = serializers.CharField(required=False, max_length=LESSON_TEXT_MAX_LENGTH)
    expected_concepts = serializers.ListField(
        child=serializers.CharField(max_length=LESSON_CONCEPT_MAX_LENGTH),
        required=False, max_length=LESSON_MAX_CONCEPTS,
    )
    speak = serializers.CharField()
    diagram = AnswerDiagramField()
    key_point = serializers.CharField(required=False, allow_blank=True)
    teacher_position = serializers.ChoiceField(
        choices=("left", "center", "right"), required=False
    )


class GeneratedAnswerSerializer(serializers.Serializer):
    def validate(self, attrs):
        if any(chunk['diagram'].get('parameters') for chunk in attrs['chunks']):
            attrs['diagram_type'] = 'circuit'
        return attrs

    def validate_chunks(self, chunks):
        for chunk in chunks:
            if chunk.get('question') and not chunk.get('expected_concepts'):
                raise serializers.ValidationError('Understanding checks require expected concepts.')
        return chunks

    chunks = AnswerChunkSerializer(many=True, allow_empty=False)
    topic = serializers.CharField(required=False)
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
