"""Persist answers only to genuine lesson checks; never infer mastery here."""
from django.db import transaction
from rest_framework.exceptions import ValidationError
from apps.classroom.models.lesson_attempt import LessonAttempt, LessonProgress
from apps.classroom.models.lecture_notes import LectureNote
from apps.classroom.services.lecture_notes import get_lecture_note


@transaction.atomic
def submit_lesson_answer(user, note_id, request_id, section_index, answer):
    note = get_lecture_note(user, note_id)
    LectureNote.objects.select_for_update().get(pk=note.pk)
    chunks = note.answer['chunks']
    if section_index >= len(chunks) or not chunks[section_index].get('question'):
        raise ValidationError('This section has no pending understanding check.')
    question = chunks[section_index]['question']
    attempt, created = LessonAttempt.objects.get_or_create(
        note=note, request_id=request_id,
        defaults={'section_index': section_index, 'question': question, 'answer': answer})
    if not created and (attempt.section_index != section_index or attempt.answer != answer):
        raise ValidationError('This request identifier has already been used for a different answer.')
    LessonProgress.objects.get_or_create(note=note, defaults={'section_index': section_index, 'waiting': True})
    return attempt
