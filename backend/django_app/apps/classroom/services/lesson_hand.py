"""Persist an account-owned hand request without changing the Q&A clock."""
from django.db import transaction
from apps.classroom.models.lesson_attempt import LessonProgress
from apps.classroom.models.lecture_notes import LectureNote
from apps.classroom.services.lecture_notes import get_lecture_note


@transaction.atomic
def lesson_hand(user, note_id, hand_raised=None):
    note = get_lecture_note(user, note_id)
    if hand_raised is None:
        progress = LessonProgress.objects.filter(note=note).first()
        raised = bool(progress and progress.hand_raised)
    else:
        LectureNote.objects.select_for_update().get(pk=note.pk)
        progress, _ = LessonProgress.objects.get_or_create(note=note)
        # QuerySet.update deliberately preserves the discussion deadline and revision.
        LessonProgress.objects.filter(pk=progress.pk).update(hand_raised=hand_raised)
        raised = hand_raised
    name = user.first_name.strip() or user.get_full_name().strip() or user.username
    return {'hand_raised': raised, 'invitation': f"{name}, what is your question about this concept?"}
