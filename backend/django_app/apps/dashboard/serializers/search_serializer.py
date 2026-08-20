"""
apps/dashboard/serializers/search_serializer.py

Django REST Framework serializers for global search responses in the Dashboard app.
"""
from rest_framework import serializers


class SearchResultActionPayloadSerializer(serializers.Serializer):
    """Payload schema specifying frontend routing targets."""
    targetTab = serializers.CharField(required=False, allow_blank=True)
    courseId = serializers.CharField(required=False, allow_blank=True)
    taskId = serializers.CharField(required=False, allow_blank=True)
    classId = serializers.CharField(required=False, allow_blank=True)


class SearchResultItemSerializer(serializers.Serializer):
    """Individual search result item contract."""
    id = serializers.CharField()
    type = serializers.ChoiceField(choices=["course", "assignment", "live_class", "topic"])
    title = serializers.CharField()
    subtitle = serializers.CharField()
    badgeText = serializers.CharField()
    actionPayload = SearchResultActionPayloadSerializer()


class SearchGroupedResultsSerializer(serializers.Serializer):
    """Categorized search results envelope contract."""
    query = serializers.CharField()
    courses = SearchResultItemSerializer(many=True)
    assignments = SearchResultItemSerializer(many=True)
    liveClasses = SearchResultItemSerializer(many=True)
    topics = SearchResultItemSerializer(many=True)
    totalCount = serializers.IntegerField()
