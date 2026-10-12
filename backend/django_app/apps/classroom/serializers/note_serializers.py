"""Notes API contracts and bounded translation input/output validation."""
from django.conf.locale import LANG_INFO
from rest_framework import serializers


class NotesQuerySerializer(serializers.Serializer):
    session_id = serializers.CharField(max_length=128, required=False)


class NoteLanguageSerializer(serializers.Serializer):
    language = serializers.CharField(max_length=16)

    def validate_language(self, value):
        value = value.strip().lower()
        if value not in LANG_INFO:
            raise serializers.ValidationError('Use a supported language code, for example en or ur.')
        return value


class NoteSectionSerializer(serializers.Serializer):
    key_point = serializers.CharField(allow_blank=True, max_length=4000)
    explanation = serializers.CharField(max_length=16000)
    formula = serializers.CharField(allow_blank=True, max_length=4000)
    annotation = serializers.CharField(allow_blank=True, max_length=4000)
    image_source = serializers.CharField(allow_blank=True, max_length=2000, required=False, default='')


class NoteSourceSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=500)
    url = serializers.URLField(max_length=2000)
    number = serializers.IntegerField(min_value=1)


class NoteContentSerializer(serializers.Serializer):
    sources = NoteSourceSerializer(many=True, required=False, default=list)
    title = serializers.CharField(max_length=2000)
    language = serializers.CharField(max_length=16)
    sections = NoteSectionSerializer(many=True, allow_empty=False)


class NoteResponseSerializer(NoteContentSerializer):
    id = serializers.UUIDField()
    version = serializers.CharField()
    created_at = serializers.DateTimeField()
    source_language = serializers.CharField()
    direction = serializers.ChoiceField(choices=['ltr', 'rtl'])
    extra_llm_tokens = serializers.IntegerField(default=0)
    figure_indices = serializers.ListField(child=serializers.IntegerField(min_value=0), default=list)


class NoteFigureSerializer(serializers.Serializer):
    section_index = serializers.IntegerField(min_value=0)
    image = serializers.CharField(max_length=2800000, trim_whitespace=False)


class NoteFigureQuerySerializer(serializers.Serializer):
    section_index = serializers.IntegerField(min_value=0)


class NoteDocumentQuerySerializer(serializers.Serializer):
    language = serializers.CharField(max_length=64)
