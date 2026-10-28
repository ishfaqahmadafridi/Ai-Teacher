"""Grounded curriculum review output, separate from the teacher's own coverage tags."""
from rest_framework import serializers
from apps.classroom.constants.lesson import (
    CURRICULUM_ID_MAX_LENGTH, CURRICULUM_EVIDENCE_MAX_LENGTH, CURRICULUM_MAX_REQUIREMENTS,
)


class CurriculumFindingSerializer(serializers.Serializer):
    requirement_id = serializers.CharField(max_length=CURRICULUM_ID_MAX_LENGTH)
    covered = serializers.BooleanField()
    evidence = serializers.CharField(max_length=CURRICULUM_EVIDENCE_MAX_LENGTH)


class CurriculumReviewSerializer(serializers.Serializer):
    level_appropriate = serializers.BooleanField()
    findings = CurriculumFindingSerializer(many=True, allow_empty=False, max_length=CURRICULUM_MAX_REQUIREMENTS)
