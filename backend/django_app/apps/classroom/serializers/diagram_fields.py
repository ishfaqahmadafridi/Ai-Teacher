"""Normalize and validate generated diagram data independently of narration schemas."""
import math
from rest_framework import serializers
from apps.classroom.utilities.serializer_data import validated_mapping
from .visual_serializers import CircuitParametersSerializer


class AnswerDiagramField(serializers.DictField):
    def to_internal_value(self, data):
        # Optional malformed display text must not discard valid narration.
        diagram = super().to_internal_value(data)
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
