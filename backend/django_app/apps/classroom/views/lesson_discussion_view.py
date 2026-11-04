"""Authenticated concept-question routing; generation and persistence live in services."""
from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from apps.classroom.views.note_views import PrivateNotesView
from apps.classroom.serializers.lesson_serializers import LessonDiscussionSerializer, LessonDiscussionReplySerializer
from apps.classroom.services.lesson_discussion import answer_discussion


class LessonDiscussionView(PrivateNotesView):
    @extend_schema(tags=['classroom'], request=LessonDiscussionSerializer, responses=LessonDiscussionReplySerializer)
    def post(self, request, note_id):
        serializer = LessonDiscussionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(LessonDiscussionReplySerializer(answer_discussion(request.user, note_id, **serializer.validated_data)).data)
