"""
URL configuration for the Classroom AI feature app.
"""
from django.urls import path
from apps.classroom.views import AskView, ClearSessionView, HealthView

from apps.classroom.views.note_views import NotesView, NoteTranslationView, NoteDocumentView, NoteFigureView

urlpatterns = [
    path("notes/<uuid:note_id>/figures/", NoteFigureView.as_view(), name="classroom-note-figures"),
    path("notes/", NotesView.as_view(), name="classroom-notes"),
    path("notes/<uuid:note_id>/translate/", NoteTranslationView.as_view(), name="classroom-note-translate"),
    path("notes/<uuid:note_id>/document/", NoteDocumentView.as_view(), name="classroom-note-document"),
    path("ask/", AskView.as_view(), name="classroom-ask"),
    path("clear/", ClearSessionView.as_view(), name="classroom-clear"),
    path("health/", HealthView.as_view(), name="classroom-health"),
]
