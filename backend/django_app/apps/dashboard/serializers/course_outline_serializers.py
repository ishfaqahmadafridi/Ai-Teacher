"""Validated ordered course outlines and AI draft responses."""
from rest_framework import serializers
from ..constants.study_plan import STUDY_PLAN_MONTH_OPTIONS
from ..constants.course_outline_prompts import (
    COURSE_OUTLINE_DETAIL_MAX_CHARACTERS, COURSE_OUTLINE_MAX_TOPICS, COURSE_OUTLINE_MAX_TITLE_LENGTH,
    COURSE_OUTLINE_MAX_SUBTOPICS, COURSE_OUTLINE_MAX_EXERCISES,
    COURSE_OUTLINE_MAX_SUBTOPIC_LENGTH, COURSE_OUTLINE_MAX_EXERCISE_LENGTH,
)


class OutlinePeriodSerializer(serializers.Serializer):
    start_date = serializers.DateField()
    duration_months = serializers.ChoiceField(choices=STUDY_PLAN_MONTH_OPTIONS)


class OutlineGenerateRequestSerializer(serializers.Serializer):
    period = OutlinePeriodSerializer(required=False)


class OutlineAssignmentSerializer(serializers.Serializer):
    exercise = serializers.CharField()
    instruction = serializers.CharField()


class OutlineQuizSerializer(serializers.Serializer):
    number = serializers.IntegerField()
    title = serializers.CharField()
    topics = serializers.ListField(child=serializers.CharField())


class OutlineWeekItemSerializer(serializers.Serializer):
    assignments = OutlineAssignmentSerializer(many=True, default=list)
    title = serializers.CharField()
    subtopics = serializers.ListField(child=serializers.CharField())
    exercises = serializers.ListField(child=serializers.CharField())
    activity = serializers.ChoiceField(choices=['Lesson', 'Practice', 'Review'])


class OutlineWeekSerializer(serializers.Serializer):
    quiz = OutlineQuizSerializer(allow_null=True, default=None)
    number = serializers.IntegerField()
    start = serializers.DateField()
    end = serializers.DateField()
    items = OutlineWeekItemSerializer(many=True)


class OutlineTopicDetailSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=COURSE_OUTLINE_MAX_TITLE_LENGTH)
    subtopics = serializers.ListField(child=serializers.CharField(max_length=COURSE_OUTLINE_MAX_SUBTOPIC_LENGTH), max_length=COURSE_OUTLINE_MAX_SUBTOPICS, default=list)
    exercises = serializers.ListField(child=serializers.CharField(max_length=COURSE_OUTLINE_MAX_EXERCISE_LENGTH), max_length=COURSE_OUTLINE_MAX_EXERCISES, default=list)

    def validate(self, data):
        if sum(len(value) for value in data['subtopics'] + data['exercises']) > COURSE_OUTLINE_DETAIL_MAX_CHARACTERS:
            raise serializers.ValidationError(f'Keep subtopics and exercises under {COURSE_OUTLINE_DETAIL_MAX_CHARACTERS} characters combined per topic.')
        return data


class CourseOutlineSerializer(serializers.Serializer):
    period = OutlinePeriodSerializer(required=False)
    topics = serializers.ListField(child=serializers.CharField(max_length=COURSE_OUTLINE_MAX_TITLE_LENGTH), min_length=1, max_length=COURSE_OUTLINE_MAX_TOPICS)
    details = OutlineTopicDetailSerializer(many=True, required=False)
    source = serializers.ChoiceField(choices=['manual', 'ai'])

    def validate(self, data):
        details = data.get('details', [])
        if len(details) > COURSE_OUTLINE_MAX_TOPICS or len({item['title'].casefold() for item in details}) != len(details):
            raise serializers.ValidationError({'details': 'Each topic may have one detail entry.'})
        if any(item['title'] not in data['topics'] for item in details):
            raise serializers.ValidationError({'details': 'Details must belong to a topic in this outline.'})
        return data

    def validate_topics(self, topics):
        if len({topic.casefold() for topic in topics}) != len(topics):
            raise serializers.ValidationError('Remove duplicate topics so each lesson has a clear place in the outline.')
        return topics


class OutlineSessionSerializer(serializers.Serializer):
    title = serializers.CharField()
    day = serializers.CharField()
    date = serializers.DateField()
    start = serializers.CharField()
    end = serializers.CharField()
    timezone = serializers.CharField(allow_blank=True)


class CourseOutlineResponseSerializer(serializers.Serializer):
    period = OutlinePeriodSerializer(allow_null=True, default=None)
    weeks = OutlineWeekSerializer(many=True, default=list)
    details = OutlineTopicDetailSerializer(many=True, default=list)
    sessions = OutlineSessionSerializer(many=True, default=list)
    topics = serializers.ListField(child=serializers.CharField())
    source = serializers.CharField(allow_blank=True)
    updated_at = serializers.DateTimeField(allow_null=True)
