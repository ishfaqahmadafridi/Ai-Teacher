"""Student response contracts."""
from rest_framework import serializers
from apps.classroom.constants.lesson import (
    LESSON_TEXT_MAX_LENGTH, LESSON_FEEDBACK_MAX_LENGTH,
    LESSON_CONCEPT_MAX_LENGTH, LESSON_MAX_CONCEPTS, LESSON_EVALUATION_ACTIONS,
)
from .answer_serializers import GeneratedAnswerSerializer


class LessonAnswerSerializer(serializers.Serializer):
    request_id = serializers.UUIDField()
    section_index = serializers.IntegerField(min_value=0)
    answer = serializers.CharField(max_length=LESSON_TEXT_MAX_LENGTH)


class LessonAttemptSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    section_index = serializers.IntegerField()
    question = serializers.CharField()
    answer = serializers.CharField()
    created_at = serializers.DateTimeField()
    evaluation = serializers.DictField()


class LessonProgressInputSerializer(serializers.Serializer):
    section_index = serializers.IntegerField(min_value=0)
    waiting = serializers.BooleanField()
    revision = serializers.IntegerField(min_value=0)


class LessonProgressSerializer(serializers.Serializer):
    answer = GeneratedAnswerSerializer(source='note.answer', read_only=True)
    question = serializers.SerializerMethodField()

    def get_question(self, obj):
        return obj.note.answer["chunks"][obj.section_index].get("question") if obj.waiting else None

    section_index = serializers.IntegerField()
    waiting = serializers.BooleanField()
    revision = serializers.IntegerField()


class LessonEvaluationSerializer(serializers.Serializer):
    outcome = serializers.ChoiceField(choices=tuple(LESSON_EVALUATION_ACTIONS))
    feedback = serializers.CharField(max_length=LESSON_FEEDBACK_MAX_LENGTH)
    missing_concepts = serializers.ListField(
        child=serializers.CharField(max_length=LESSON_CONCEPT_MAX_LENGTH),
        max_length=LESSON_MAX_CONCEPTS,
    )
    next_action = serializers.ChoiceField(choices=tuple(LESSON_EVALUATION_ACTIONS.values()))

    def validate(self, attrs):
        if attrs['next_action'] != LESSON_EVALUATION_ACTIONS[attrs['outcome']]:
            raise serializers.ValidationError('Outcome and next action disagree.')
        return attrs
