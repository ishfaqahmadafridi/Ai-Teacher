"""Create a new repaired note version without changing original teaching history."""
from copy import deepcopy
from django.core.cache import cache
from apps.classroom.models.lecture_notes import LectureNote
from apps.classroom.services.lecture_notes import save_lecture_note
from apps.classroom.services.visual_planning import plan_missing_visuals
from apps.classroom.services.lesson_visuals import resolve_lesson_visuals


def repair_note_visuals(note_id):
    note = LectureNote.objects.get(pk=note_id)
    key = 'visual-repair:v2:' + str(note.id)
    repaired_id = cache.get(key)
    if repaired_id:
        repaired = LectureNote.objects.filter(pk=repaired_id, user=note.user).first()
        if repaired:
            return repaired
    lock = key + ':lock'
    if not cache.add(lock, True, timeout=300):
        return note
    try:
        answer = deepcopy(note.answer)
        plan_missing_visuals(answer)
        answer = resolve_lesson_visuals(answer)
        answer.pop('visual_selection_tokens', None)
        repaired = save_lecture_note(note.user, note.session_id, answer)
        cache.set(key, str(repaired.id), timeout=86400)
        return repaired
    finally:
        cache.delete(lock)
