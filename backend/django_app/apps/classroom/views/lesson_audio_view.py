"""Private zero-inference WAV export for saved lesson chunks."""
from django.http import HttpResponse
from rest_framework.exceptions import ValidationError
from apps.classroom.serializers.lesson_audio_serializers import LessonAudioRequestSerializer
from drf_spectacular.utils import extend_schema
from rest_framework.throttling import UserRateThrottle
from apps.classroom.views.note_views import PrivateNotesView
from apps.classroom.services.lecture_notes import get_lecture_note
from apps.classroom.services.lesson_audio import lesson_audio
from apps.classroom.constants.audio import AUDIO_REQUEST_RATE


class LessonAudioThrottle(UserRateThrottle):
    rate = AUDIO_REQUEST_RATE


class LessonAudioView(PrivateNotesView):
    throttle_classes = [LessonAudioThrottle]

    @extend_schema(tags=['classroom'], responses={(200, 'audio/wav'): bytes})
    def get(self, request, note_id, section_index):
        note = get_lecture_note(request.user, note_id)
        return HttpResponse(lesson_audio(note, section_index), content_type='audio/wav')

    @extend_schema(tags=['classroom'], request=LessonAudioRequestSerializer, responses={(200, 'audio/wav'): bytes})
    def post(self, request, note_id, section_index):
        data = LessonAudioRequestSerializer(data=request.data)
        data.is_valid(raise_exception=True)
        note = get_lecture_note(request.user, note_id)
        chunks = note.answer['chunks']
        if section_index >= len(chunks) or chunks[section_index]['speak'] != data.validated_data['speak']:
            raise ValidationError('This audio segment does not match the saved lesson.')
        return HttpResponse(lesson_audio(note, section_index), content_type='audio/wav')
