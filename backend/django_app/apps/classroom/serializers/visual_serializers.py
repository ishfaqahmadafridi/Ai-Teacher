"""Numerical contract for the supported single-resistor visual."""
import math
from rest_framework import serializers


class CircuitParametersSerializer(serializers.Serializer):
    voltage = serializers.FloatField(min_value=0, max_value=48)
    resistance = serializers.FloatField(min_value=1, max_value=100)

    def validate(self, attrs):
        if not all(math.isfinite(value) for value in attrs.values()):
            raise serializers.ValidationError('Circuit values must be finite.')
        return attrs
