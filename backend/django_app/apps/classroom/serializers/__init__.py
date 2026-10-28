"""
apps/classroom/serializers/__init__.py
"""
from .ask_serializers import (
    AskRequestSerializer,
    ClearSessionRequestSerializer, ClearSessionResponseSerializer,
)

__all__ = [
    'AskRequestSerializer',
    'AskResponseSerializer',
    'GeneratedAnswerSerializer',
    'ClearSessionRequestSerializer',
    'ClearSessionResponseSerializer',
]

from .note_serializers import NotesQuerySerializer, NoteLanguageSerializer, NoteContentSerializer, NoteResponseSerializer, NoteFigureSerializer

from .lesson_audio_serializers import LessonAudioRequestSerializer

from .answer_serializers import AnswerChunkSerializer, AskResponseSerializer, GeneratedAnswerSerializer
from .diagram_fields import AnswerDiagramField

__all__ += ['AnswerChunkSerializer', 'AnswerDiagramField']
