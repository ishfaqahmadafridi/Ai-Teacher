"""Normalize and validate generated diagram data independently of narration schemas."""
import math
from rest_framework import serializers
from apps.classroom.utilities.serializer_data import validated_mapping
from .visual_serializers import CircuitParametersSerializer
from apps.classroom.constants.visuals import DIAGRAM_ACTIONS, STRUCTURED_VISUAL_FIELDS


class AnswerDiagramField(serializers.DictField):
    def to_representation(self, value):
        # Older saved lectures must receive the same contract repair as new output.
        return self.to_internal_value(value)

    def to_internal_value(self, data):
        # Optional malformed display text must not discard valid narration.
        diagram = super().to_internal_value(data)
        if diagram.get('action') not in DIAGRAM_ACTIONS:
            diagram['action'] = 'none'
        if 'speed' in diagram and diagram['speed'] not in ('slow', 'fast'):
            diagram.pop('speed')
        animation = diagram.get('animate')
        if 'animate' in diagram and (
            not isinstance(animation, dict) or
            any(not isinstance(animation.get(field), str) for field in ('object', 'move', 'speed'))
        ):
            diagram.pop('animate')
        if 'visual_status' in diagram and diagram['visual_status'] not in ('retrieved', 'unavailable', 'fallback'):
            diagram.pop('visual_status')
        if 'visual_reason' in diagram and not isinstance(diagram['visual_reason'], str):
            diagram.pop('visual_reason')
        if 'visual_priority' in diagram:
            diagram['visual_priority'] = serializers.FloatField(min_value=0, max_value=1).run_validation(diagram['visual_priority'])
            if not math.isfinite(diagram['visual_priority']):
                raise serializers.ValidationError('Visual priority must be finite.')
        kind = diagram.get('kind')
        fields = STRUCTURED_VISUAL_FIELDS.get(kind) if isinstance(kind, str) else None
        if fields and 'visual' not in diagram:
            diagram['visual'] = {field: diagram.pop(field) for field in fields if field in diagram}
        from .structured_visual_serializers import StructuredVisualSerializer
        for field in ('visual', 'fallback_visual'):
            if field not in diagram:
                continue
            visual = StructuredVisualSerializer(data=diagram[field])
            if visual.is_valid():
                diagram[field] = validated_mapping(visual.validated_data)
            else:
                diagram.pop(field)
                if field == 'visual':
                    diagram['visual_status'] = 'unavailable'
                    diagram['visual_reason'] = 'invalid_visual'
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
            if diagram.get('visual_status') == 'unavailable':
                diagram.pop('visual_status', None)
                diagram.pop('visual_reason', None)
        return diagram
