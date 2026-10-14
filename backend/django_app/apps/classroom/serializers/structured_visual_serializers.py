"""Bounded declarative visuals; no generated executable code."""
import math
from rest_framework import serializers


class TreeNodeSerializer(serializers.Serializer):
    id = serializers.CharField(max_length=40)
    label = serializers.CharField(max_length=80)
    parent = serializers.CharField(max_length=40, required=False, allow_null=True)


class StructuredVisualSerializer(serializers.Serializer):
    kind = serializers.ChoiceField(choices=('tree', 'polynomial'))
    nodes = TreeNodeSerializer(many=True, required=False)
    coefficients = serializers.ListField(child=serializers.FloatField(), max_length=6, required=False)
    x_min = serializers.FloatField(min_value=-100, max_value=100, required=False)
    x_max = serializers.FloatField(min_value=-100, max_value=100, required=False)

    def validate(self, attrs):
        if attrs['kind'] == 'polynomial':
            coefficients = attrs.get('coefficients', [])
            low, high = attrs.get('x_min'), attrs.get('x_max')
            if not coefficients or low is None or high is None or low >= high or not all(math.isfinite(v) and abs(v) <= 10000 for v in coefficients):
                raise serializers.ValidationError('Invalid polynomial range or coefficients')
        else:
            nodes = attrs.get('nodes', [])
            ids = {node['id'] for node in nodes}
            if not 1 <= len(nodes) <= 31 or len(ids) != len(nodes) or sum(not node.get('parent') for node in nodes) != 1:
                raise serializers.ValidationError('Invalid tree nodes')
            parents = {node['id']: node.get('parent') for node in nodes}
            for node in nodes:
                seen = set()
                current = node['id']
                while current:
                    if current in seen or current not in parents:
                        raise serializers.ValidationError('Tree cycle or missing parent')
                    seen.add(current)
                    current = parents[current]
        return attrs
