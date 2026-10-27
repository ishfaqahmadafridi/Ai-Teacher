"""Grounded curriculum review output, separate from the teacher's own coverage tags."""
from rest_framework import serializers


class CurriculumFindingSerializer(serializers.Serializer):
    requirement_id = serializers.CharField(max_length=64)
    covered = serializers.BooleanField()
    evidence = serializers.CharField(max_length=16000)


class CurriculumReviewSerializer(serializers.Serializer):
    level_appropriate = serializers.BooleanField()
    findings = CurriculumFindingSerializer(many=True, allow_empty=False, max_length=100)
