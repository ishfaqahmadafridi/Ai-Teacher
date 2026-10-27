"""
apps/classroom/serializers/ask_serializers.py

Request and response serializers for the Ask/Classroom endpoint.
"""
from apps.classroom.utilities.serializer_data import validated_mapping
import math
from rest_framework import serializers
from .session_fields import PublicSessionIdField
from .visual_serializers import CircuitParametersSerializer
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
        max_length=2000,
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


class AnswerChunkSerializer(serializers.Serializer):
    curriculum_ids = serializers.ListField(child=serializers.CharField(max_length=64), required=False, max_length=100)
    def validate_diagram(self, diagram):
        # Optional malformed display text must not discard valid narration.
        diagram = dict(diagram)
        if 'visual_priority' in diagram:
            diagram['visual_priority'] = serializers.FloatField(min_value=0, max_value=1).run_validation(diagram['visual_priority'])
            if not math.isfinite(diagram['visual_priority']):
                raise serializers.ValidationError('Visual priority must be finite.')
        if diagram.get('kind') in ('tree', 'polynomial') and 'visual' not in diagram:
            fields = ('kind', 'nodes', 'coefficients', 'x_min', 'x_max')
            diagram['visual'] = {field: diagram.pop(field) for field in fields if field in diagram}
        if 'visual' in diagram:
            from .structured_visual_serializers import StructuredVisualSerializer
            visual = StructuredVisualSerializer(data=diagram['visual'])
            if visual.is_valid():
                diagram['visual'] = validated_mapping(visual.validated_data)
            else:
                diagram.pop('visual')
        for field in ("annotation", "annotation_position", "target", "formula"):
            if field in diagram and not isinstance(diagram[field], str):
                diagram.pop(field)
        from apps.classroom.constants.research import IMAGE_RESULT_LIMIT
        diagram.pop('asset_id', None)
        if 'image_query' in diagram:
            diagram['image_query'] = serializers.CharField(max_length=150, min_length=2).run_validation(diagram['image_query'])
        if 'image_ref' in diagram:
            reference = diagram['image_ref']
            if isinstance(reference, bool) or not isinstance(reference, int) or not 1 <= reference <= IMAGE_RESULT_LIMIT:
                raise serializers.ValidationError('Invalid image reference.')
        if 'parameters' in diagram:
            parameters = CircuitParametersSerializer(data=diagram['parameters'])
            parameters.is_valid(raise_exception=True)
            diagram = {**diagram, 'parameters': validated_mapping(parameters.validated_data)}
        if diagram.get('visual') or diagram.get('parameters'):
            diagram.pop('image_query', None)
        return diagram

    question = serializers.CharField(required=False, max_length=2000)
    expected_concepts = serializers.ListField(child=serializers.CharField(max_length=500), required=False, max_length=10)
    speak = serializers.CharField()
    diagram = serializers.DictField()
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
        for index, chunk in enumerate(chunks):
            if chunk.get('question') and (index != len(chunks) - 1 or not chunk.get('expected_concepts')):
                raise serializers.ValidationError('Understanding checks require expected concepts and must finish the response.')
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
