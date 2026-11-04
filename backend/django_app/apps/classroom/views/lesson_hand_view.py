"""Authenticated hand requests for the next concept question period."""
from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from apps.classroom.views.note_views import PrivateNotesView
from apps.classroom.serializers.lesson_serializers import LessonHandInputSerializer, LessonHandSerializer
from apps.classroom.services.lesson_hand import lesson_hand


class LessonHandView(PrivateNotesView):
    @extend_schema(tags=['classroom'], responses=LessonHandSerializer)
    def get(self, request, note_id):
        return Response(LessonHandSerializer(lesson_hand(request.user, note_id)).data)

    @extend_schema(tags=['classroom'], request=LessonHandInputSerializer, responses=LessonHandSerializer)
    def put(self, request, note_id):
        serializer = LessonHandInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(LessonHandSerializer(lesson_hand(request.user, note_id, **serializer.validated_data)).data)
