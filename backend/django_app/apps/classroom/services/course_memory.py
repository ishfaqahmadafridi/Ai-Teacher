"""
apps/classroom/services/course_memory.py

Recall a student's previous classes in the same course, so the teacher can connect today's
lesson to them ("Last class we found the roots; the discriminant was hard...").

WHY BUILT FROM RECORDS, NOT STORED OR GENERATED:
    - Single source of truth: notes, graded attempts and progress already hold what happened.
      Deriving the summary when a class starts means there is no second copy to go stale and
      no "end of class" trigger to miss.
    - Evidence only: weak points come from graded answers and doubts from what the student
      actually asked. No model writes or guesses them (AI rule AI-11).
    - Small context: at most COURSE_MEMORY_CLASSES classes with capped, truncated lists, sent
      instead of whole previous lectures.
    - Isolation: scoped to one user and one course key; other courses and students never appear.
"""
from apps.classroom.constants.lesson import (
    COURSE_MEMORY_CLASSES, COURSE_MEMORY_DOUBT_OUTCOME, COURSE_MEMORY_GRADED_OUTCOMES, COURSE_MEMORY_ITEMS,
    COURSE_MEMORY_NOTE_SCAN, COURSE_MEMORY_TEXT_LENGTH, COURSE_MEMORY_WEAK_OUTCOMES,
)
from apps.classroom.models.lecture_notes import LectureNote
from apps.classroom.utilities.course_memory import clip_items, normalize_course_key


def latest_graded_answers(notes):
    """Latest graded answer per (note, section): a later correct answer clears an earlier miss.

    Doubts and Q&A replies are not answers, so they never clear (or create) a weak point.
    """
    latest = {}
    for note in notes:
        for attempt in sorted(note.attempts.all(), key=lambda item: item.created_at):
            if attempt.evaluation.get('outcome') in COURSE_MEMORY_GRADED_OUTCOMES:
                latest[(note.pk, attempt.section_index)] = attempt
    return latest.values()


def weak_points(notes):
    """Checks whose latest graded answer was a misconception or unclear, with the missed concepts."""
    items = []
    for attempt in latest_graded_answers(notes):
        evaluation = attempt.evaluation
        if evaluation.get('outcome') in COURSE_MEMORY_WEAK_OUTCOMES:
            missed = ', '.join(evaluation.get('missing_concepts', []))
            items.append(f'{attempt.question} (missed: {missed})' if missed else attempt.question)
    return clip_items(items, COURSE_MEMORY_ITEMS, COURSE_MEMORY_TEXT_LENGTH)


def open_doubts(notes):
    """What the student asked: doubts during checks and questions in Q&A windows."""
    items = []
    for note in notes:
        chunks = note.answer['chunks']
        for attempt in note.attempts.all():
            in_qa = attempt.section_index < len(chunks) and bool(chunks[attempt.section_index].get('discussion_prompt'))
            if in_qa or attempt.evaluation.get('outcome') == COURSE_MEMORY_DOUBT_OUTCOME:
                items.append(attempt.answer)
    return clip_items(items, COURSE_MEMORY_ITEMS, COURSE_MEMORY_TEXT_LENGTH)


def covered_points(notes):
    """Key points the lessons actually taught, in teaching order."""
    points = [chunk['key_point'] for note in notes for chunk in note.answer['chunks'] if chunk.get('key_point')]
    return clip_items(list(dict.fromkeys(points)), COURSE_MEMORY_ITEMS, COURSE_MEMORY_TEXT_LENGTH)


def reached_end(notes):
    """True when the student's saved progress reached the last section of the class lesson."""
    lesson = notes[0]
    progress = getattr(lesson, 'progress', None)
    return bool(progress) and progress.section_index >= len(lesson.answer['chunks']) - 1


def class_summary(notes):
    """Summary of one scheduled class; `notes` are its notes oldest first (lesson, then follow-ups)."""
    return {
        'topic': notes[0].answer.get('topic', '')[:COURSE_MEMORY_TEXT_LENGTH],
        'completed': reached_end(notes),
        'covered': covered_points(notes),
        'weak_points': weak_points(notes),
        'open_doubts': open_doubts(notes),
    }


def previous_classes(user, course_label, current_session_id):
    """Summaries of the student's most recent previous classes in this course, oldest first."""
    course_key = normalize_course_key(course_label)
    if not course_key:
        return []
    recent = (LectureNote.objects.filter(user=user, course_key=course_key)
              .exclude(scheduled_session_id__in=['', str(current_session_id)])
              .select_related('progress').prefetch_related('attempts')
              .order_by('-created_at')[:COURSE_MEMORY_NOTE_SCAN])
    sessions = {}
    for note in recent:
        if note.scheduled_session_id in sessions or len(sessions) < COURSE_MEMORY_CLASSES:
            sessions.setdefault(note.scheduled_session_id, []).append(note)
    return [class_summary(list(reversed(notes))) for notes in reversed(list(sessions.values()))]
