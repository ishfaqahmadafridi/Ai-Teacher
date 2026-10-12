"""Account-owned playback cursor with optimistic concurrency."""
from django.db import transaction
from rest_framework.exceptions import APIException, ValidationError
from apps.classroom.models.lesson_attempt import LessonProgress
from apps.classroom.models.lecture_notes import LectureNote
from apps.classroom.services.lecture_notes import get_lecture_note


class StaleLessonRevision(APIException):
    status_code = 409
    default_detail = 'The lesson changed. Reload its current position.'


@transaction.atomic
def lesson_progress(user, note_id, update=None):
    note = get_lecture_note(user, note_id)
    LectureNote.objects.select_for_update().get(pk=note.pk)
    progress, _ = LessonProgress.objects.get_or_create(note=note)
    if update is not None:
        index = update['section_index']
        if index >= len(note.answer['chunks']):
            raise ValidationError('Unknown lesson section.')
        if update['waiting'] and not note.answer['chunks'][index].get('question'):
            raise ValidationError('This section has no understanding check.')
        if update['revision'] != progress.revision:
            raise StaleLessonRevision()
        progress.section_index = index
        progress.waiting = update['waiting']
        progress.revision += 1
        progress.save()
    return progress
