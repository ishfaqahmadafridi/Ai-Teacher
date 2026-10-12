"""
URL configuration for the Classroom AI feature app.
"""
from django.urls import path
from apps.classroom.views import AskView, ClearSessionView, HealthView

from apps.classroom.views.note_views import NotesView, NoteTranslationView, NoteDocumentView, NoteFigureView

from apps.classroom.views.lesson_views import LessonAnswerView, LessonProgressView, LessonEvaluationView

from apps.classroom.views.lesson_audio_view import LessonAudioView

urlpatterns = [
    path("notes/<uuid:note_id>/audio/<int:section_index>/", LessonAudioView.as_view(), name="classroom-lesson-audio"),
    path("notes/<uuid:note_id>/answers/<uuid:attempt_id>/evaluate/", LessonEvaluationView.as_view(), name="classroom-lesson-evaluate"),
    path("notes/<uuid:note_id>/progress/", LessonProgressView.as_view(), name="classroom-lesson-progress"),
    path("notes/<uuid:note_id>/answers/", LessonAnswerView.as_view(), name="classroom-lesson-answer"),
    path("notes/<uuid:note_id>/figures/", NoteFigureView.as_view(), name="classroom-note-figures"),
    path("notes/", NotesView.as_view(), name="classroom-notes"),
    path("notes/<uuid:note_id>/translate/", NoteTranslationView.as_view(), name="classroom-note-translate"),
    path("notes/<uuid:note_id>/document/", NoteDocumentView.as_view(), name="classroom-note-document"),
    path("ask/", AskView.as_view(), name="classroom-ask"),
    path("clear/", ClearSessionView.as_view(), name="classroom-clear"),
    path("health/", HealthView.as_view(), name="classroom-health"),
]
