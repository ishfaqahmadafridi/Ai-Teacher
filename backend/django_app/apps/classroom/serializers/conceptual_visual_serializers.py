"""Validate labelled schematic graphs and approved conceptual 3D parameters."""
import math
from rest_framework import serializers
from apps.classroom.constants.visuals import (
    ASSEMBLY_PARTS, MOLECULE_ATOM_COUNTS, SCHEMATIC_MAX_NODES,
    SCHEMATIC_MAX_EDGES, VISUAL_ID_LENGTH, VISUAL_LABEL_LENGTH, VISUAL_NO_FOCUS,
)


def _validate_focus(attrs, parts):
    focus = attrs.get('focus')
    if focus in VISUAL_NO_FOCUS and focus not in parts:
        attrs.pop('focus')
    elif focus and focus not in parts:
        raise serializers.ValidationError('Unknown visual focus part.')
    return attrs


class SchematicNodeSerializer(serializers.Serializer):
    id = serializers.CharField(max_length=VISUAL_ID_LENGTH)
    label = serializers.CharField(max_length=VISUAL_LABEL_LENGTH)
    x = serializers.FloatField(min_value=0, max_value=1)
    y = serializers.FloatField(min_value=0, max_value=1)

    def validate(self, attrs):
        if not all(math.isfinite(attrs[key]) for key in ('x', 'y')):
            raise serializers.ValidationError('Diagram coordinates must be finite.')
        return attrs


class SchematicEdgeSerializer(serializers.Serializer):
    source = serializers.CharField(max_length=VISUAL_ID_LENGTH)
    target = serializers.CharField(max_length=VISUAL_ID_LENGTH)
    label = serializers.CharField(max_length=VISUAL_LABEL_LENGTH, required=False)


class SchematicVisualSerializer(serializers.Serializer):
    kind = serializers.ChoiceField(choices=('schematic',))
    title = serializers.CharField(max_length=VISUAL_LABEL_LENGTH)
    nodes = SchematicNodeSerializer(many=True, allow_empty=False, max_length=SCHEMATIC_MAX_NODES)
    edges = SchematicEdgeSerializer(many=True, max_length=SCHEMATIC_MAX_EDGES)
    focus = serializers.CharField(max_length=VISUAL_ID_LENGTH, required=False)

    def validate(self, attrs):
        ids = {node['id'] for node in attrs['nodes']}
        if len(ids) != len(attrs['nodes']):
            raise serializers.ValidationError('Diagram IDs and focus must identify unique nodes.')
        if any(edge['source'] not in ids or edge['target'] not in ids or edge['source'] == edge['target'] for edge in attrs['edges']):
            raise serializers.ValidationError('Diagram edges must connect distinct existing nodes.')
        if len({(edge['source'], edge['target']) for edge in attrs['edges']}) != len(attrs['edges']):
            raise serializers.ValidationError('Duplicate diagram edges.')
        return _validate_focus(attrs, ids)


class AssemblyVisualSerializer(serializers.Serializer):
    kind = serializers.ChoiceField(choices=('assembly',))
    model = serializers.ChoiceField(choices=tuple(ASSEMBLY_PARTS))
    molecule = serializers.ChoiceField(choices=tuple(MOLECULE_ATOM_COUNTS), required=False)
    focus = serializers.CharField(max_length=VISUAL_ID_LENGTH, required=False)
    phase = serializers.FloatField(min_value=0, max_value=1, default=0.5)

    def validate(self, attrs):
        if not math.isfinite(attrs['phase']):
            raise serializers.ValidationError('Model phase must be finite.')
        parts = ASSEMBLY_PARTS[attrs['model']]
        if attrs['model'] == 'molecule':
            if not attrs.get('molecule'):
                raise serializers.ValidationError('Choose a supported molecule.')
            parts = tuple(f'atom_{index}' for index in range(MOLECULE_ATOM_COUNTS[attrs['molecule']])) + ('bonds',)
        elif 'molecule' in attrs:
            raise serializers.ValidationError('Molecule parameters require the molecule builder.')
        return _validate_focus(attrs, parts)
