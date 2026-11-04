"""Generated lesson and public response schemas, separate from request validation."""
from rest_framework import serializers
from apps.classroom.constants.lesson import (
    CURRICULUM_ID_MAX_LENGTH, CURRICULUM_MAX_REQUIREMENTS,
    LESSON_TEXT_MAX_LENGTH, LESSON_CONCEPT_MAX_LENGTH, LESSON_MAX_CONCEPTS,
)
from .diagram_fields import AnswerDiagramField
from apps.classroom.constants.visuals import DIAGRAM_TYPES


from apps.classroom.constants.teaching_quality import LESSON_MODES, TEACHING_STEPS, CONCEPT_ID_LENGTH


class AnswerChunkSerializer(serializers.Serializer):
    concept_id = serializers.CharField(required=False, max_length=CONCEPT_ID_LENGTH)
    teaching_step = serializers.ChoiceField(choices=TEACHING_STEPS, required=False)
    curriculum_ids = serializers.ListField(
        child=serializers.CharField(max_length=CURRICULUM_ID_MAX_LENGTH),
        required=False, max_length=CURRICULUM_MAX_REQUIREMENTS,
    )

    discussion_prompt = serializers.CharField(required=False, max_length=LESSON_TEXT_MAX_LENGTH)
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
    lesson_mode = serializers.ChoiceField(choices=LESSON_MODES, required=False)
    def validate(self, attrs):
        if any(chunk['diagram'].get('parameters') for chunk in attrs['chunks']):
            attrs['diagram_type'] = 'circuit'
        return attrs

    def validate_diagram_type(self, value):
        return value if value in DIAGRAM_TYPES else 'default'

    def validate_chunks(self, chunks):
        for chunk in chunks:
            if chunk.get('discussion_prompt') and (chunk.get('question') or chunk.get('expected_concepts')):
                raise serializers.ValidationError('Discussion invitations cannot contain graded assessment fields.')
            if chunk.get('question') and not chunk.get('expected_concepts'):
                raise serializers.ValidationError('Understanding checks require expected concepts.')
            if chunk.get('expected_concepts') and not chunk.get('question'):
                raise serializers.ValidationError('Assessment criteria require a question.')
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
