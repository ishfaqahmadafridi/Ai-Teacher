"""Authorized understanding-check answer submission."""
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from apps.classroom.views.note_views import PrivateNotesView
from apps.classroom.serializers.lesson_serializers import LessonAnswerSerializer, LessonAttemptSerializer
from apps.classroom.services.lesson_answers import submit_lesson_answer
from apps.classroom.services.lesson_evaluation import evaluate_attempt


class LessonAnswerView(PrivateNotesView):
    @extend_schema(tags=['classroom'], request=LessonAnswerSerializer, responses=LessonAttemptSerializer)
    def post(self, request, note_id):
        serializer = LessonAnswerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        attempt = submit_lesson_answer(request.user, note_id, **serializer.validated_data)
        return Response(LessonAttemptSerializer(attempt).data)


from apps.classroom.serializers.lesson_serializers import LessonProgressInputSerializer, LessonProgressSerializer
from apps.classroom.services.lesson_progress import lesson_progress


class LessonProgressView(PrivateNotesView):
    @extend_schema(tags=['classroom'], responses=LessonProgressSerializer)
    def get(self, request, note_id):
        return Response(LessonProgressSerializer(lesson_progress(request.user, note_id)).data)

    @extend_schema(tags=['classroom'], request=LessonProgressInputSerializer, responses=LessonProgressSerializer)
    def put(self, request, note_id):
        serializer = LessonProgressInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(LessonProgressSerializer(lesson_progress(request.user, note_id, serializer.validated_data)).data)


class LessonEvaluationView(PrivateNotesView):
    @extend_schema(tags=['classroom'], responses=LessonAttemptSerializer)
    def post(self, request, note_id, attempt_id):
        from django.shortcuts import get_object_or_404
        from apps.classroom.models.lesson_attempt import LessonAttempt
        attempt = get_object_or_404(LessonAttempt, pk=attempt_id, note_id=note_id, note__user=request.user)
        return Response(LessonAttemptSerializer(evaluate_attempt(attempt)).data)
