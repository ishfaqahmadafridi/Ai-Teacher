"""Validate saved chunk identity before generating audio."""
from rest_framework import serializers
from apps.classroom.constants.audio import AUDIO_MAX_CHARACTERS


class LessonAudioRequestSerializer(serializers.Serializer):
    speak = serializers.CharField(max_length=AUDIO_MAX_CHARACTERS, trim_whitespace=False)
