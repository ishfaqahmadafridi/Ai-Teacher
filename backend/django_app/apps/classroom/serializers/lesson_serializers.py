"""Student response contracts."""
from rest_framework import serializers
from datetime import timedelta
from django.utils import timezone
from apps.classroom.constants.lesson import DISCUSSION_WINDOW_SECONDS
from apps.classroom.constants.lesson import (
    LESSON_TEXT_MAX_LENGTH, LESSON_FEEDBACK_MAX_LENGTH,
    LESSON_CONCEPT_MAX_LENGTH, LESSON_MAX_CONCEPTS, LESSON_EVALUATION_ACTIONS,
)
from .answer_serializers import GeneratedAnswerSerializer


class LessonSectionRequestSerializer(serializers.Serializer):
    request_id = serializers.UUIDField()
    section_index = serializers.IntegerField(min_value=0)


class LessonAnswerSerializer(LessonSectionRequestSerializer):
    answer = serializers.CharField(max_length=LESSON_TEXT_MAX_LENGTH)


class LessonDiscussionSerializer(LessonSectionRequestSerializer):
    question = serializers.CharField(max_length=LESSON_TEXT_MAX_LENGTH)


class LessonDiscussionReplySerializer(serializers.Serializer):
    id = serializers.UUIDField()
    reply = serializers.CharField(max_length=LESSON_FEEDBACK_MAX_LENGTH)


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
    discussion_expires_at = serializers.SerializerMethodField()
    server_now = serializers.SerializerMethodField()

    def get_server_now(self, obj):
        return timezone.now().isoformat()

    def get_discussion_expires_at(self, obj):
        if obj.waiting and obj.updated_at and obj.note.answer['chunks'][obj.section_index].get('discussion_prompt'):
            return (obj.updated_at + timedelta(seconds=DISCUSSION_WINDOW_SECONDS)).isoformat()
        return None

    def get_question(self, obj):
        return (obj.note.answer["chunks"][obj.section_index].get("question") or obj.note.answer["chunks"][obj.section_index].get("discussion_prompt")) if obj.waiting else None

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
        if attrs['outcome'] == 'understood' and attrs['missing_concepts']:
            raise serializers.ValidationError('An understood answer cannot have missing concepts.')
        return attrs


class LessonHandInputSerializer(serializers.Serializer):
    hand_raised = serializers.BooleanField()


class LessonHandSerializer(LessonHandInputSerializer):
    invitation = serializers.CharField()
