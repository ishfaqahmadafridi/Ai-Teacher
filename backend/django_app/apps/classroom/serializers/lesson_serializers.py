"""Student response contracts."""
from rest_framework import serializers


class LessonAnswerSerializer(serializers.Serializer):
    request_id = serializers.UUIDField()
    section_index = serializers.IntegerField(min_value=0)
    answer = serializers.CharField(max_length=2000)


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
    question = serializers.SerializerMethodField()

    def get_question(self, obj):
        return obj.note.answer["chunks"][obj.section_index].get("question") if obj.waiting else None

    section_index = serializers.IntegerField()
    waiting = serializers.BooleanField()
    revision = serializers.IntegerField()


class LessonEvaluationSerializer(serializers.Serializer):
    outcome = serializers.ChoiceField(choices=['understood', 'misconception', 'unclear'])
    feedback = serializers.CharField(max_length=4000)
    missing_concepts = serializers.ListField(child=serializers.CharField(max_length=500), max_length=10)
    next_action = serializers.ChoiceField(choices=['continue', 'reteach', 'clarify'])

    def validate(self, data):
        expected = {'understood': 'continue', 'misconception': 'reteach', 'unclear': 'clarify'}
        if data['next_action'] != expected[data['outcome']]:
            raise serializers.ValidationError('Outcome and next action disagree.')
        return data
