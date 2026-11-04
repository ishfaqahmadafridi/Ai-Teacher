"""Strict independent review findings for new teaching responses."""
from rest_framework import serializers
from apps.classroom.constants.teaching_quality import (
    QUALITY_CHECKS, QUALITY_MAX_FINDINGS, QUALITY_REASON_LENGTH, QUALITY_QUOTE_LENGTH,
)


class TeachingFindingSerializer(serializers.Serializer):
    check = serializers.ChoiceField(choices=QUALITY_CHECKS)
    passed = serializers.BooleanField()
    reason = serializers.CharField(max_length=QUALITY_REASON_LENGTH)
    section_index = serializers.IntegerField(min_value=0, required=False)
    quote = serializers.CharField(max_length=QUALITY_QUOTE_LENGTH, required=False)


class TeachingReviewSerializer(serializers.Serializer):
    findings = TeachingFindingSerializer(many=True, allow_empty=False, max_length=QUALITY_MAX_FINDINGS)

    def validate_findings(self, findings):
        names = [finding['check'] for finding in findings]
        if len(names) != len(QUALITY_CHECKS) or set(names) != set(QUALITY_CHECKS):
            raise serializers.ValidationError('Each teaching quality check must occur exactly once.')
        return findings
