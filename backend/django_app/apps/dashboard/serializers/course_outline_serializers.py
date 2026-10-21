"""Validated ordered course outlines and AI draft responses."""
from rest_framework import serializers


class CourseOutlineSerializer(serializers.Serializer):
    topics = serializers.ListField(child=serializers.CharField(max_length=255), min_length=1, max_length=60)
    source = serializers.ChoiceField(choices=['manual', 'ai'])

    def validate_topics(self, topics):
        if len({topic.casefold() for topic in topics}) != len(topics):
            raise serializers.ValidationError('Remove duplicate topics so each lesson has a clear place in the outline.')
        return topics


class CourseOutlineResponseSerializer(serializers.Serializer):
    topics = serializers.ListField(child=serializers.CharField())
    source = serializers.CharField(allow_blank=True)
    updated_at = serializers.DateTimeField(allow_null=True)
