"""
apps/classroom/utilities/subject_resolution.py

Decide which subject's teaching rules a lesson gets, in code (AI rule AI-6).

WHY A PURE UTILITY:
    Choosing rules has a correct answer that saved data can give; a model can guess wrongly.
    Pure functions are fast and testable without a database or provider.

RULES:
    1. A course label decides (a "Mathematics" class always gets mathematics rules).
    2. Without a course, topic hints decide; if several subjects match, the strongest
       MAX_LESSON_SUBJECTS are kept rather than guessing one.
    3. Nothing matches → the general rules, never another subject's rules.
"""
import re
from apps.classroom.constants.subjects import GENERAL_SUBJECT, MAX_LESSON_SUBJECTS, SUBJECTS, SUBJECT_TOPIC_HINTS


def mentions(text, phrase):
    """Whole-word (or whole-phrase) match, allowing a plural 's'."""
    return re.search(r'\b' + re.escape(phrase) + r's?\b', text, re.IGNORECASE) is not None


def subject_from_course(label):
    """Subject ID for a course label, or None when the label names no known subject."""
    text = ' '.join((label or '').split())
    return next((subject for subject, entry in SUBJECTS.items()
                 if any(mentions(text, alias) for alias in entry['aliases'])), None)


def subjects_from_topic(text):
    """Subjects whose topic hints appear, strongest first (most distinct hints matched)."""
    scores = {subject: sum(mentions(text, hint) for hint in hints) for subject, hints in SUBJECT_TOPIC_HINTS.items()}
    ranked = sorted((subject for subject, score in scores.items() if score), key=lambda subject: -scores[subject])
    return ranked[:MAX_LESSON_SUBJECTS]


def resolve_lesson_subjects(course_label, topic_text):
    """Subject IDs whose rules this lesson receives (course first, then topic, then general)."""
    course_subject = subject_from_course(course_label)
    if course_subject:
        return (course_subject,)
    return tuple(subjects_from_topic(topic_text)) or (GENERAL_SUBJECT,)
