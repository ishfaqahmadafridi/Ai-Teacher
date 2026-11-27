"""
apps/classroom/utilities/course_memory.py

Pure helpers for course memory: a stable course key and bounded text lists.

WHY A SEPARATE UTILITY:
    The same course key must be produced when a class is saved and when it is recalled, and
    every list sent to the model must stay within the context budget. Pure functions make both
    rules testable without a database.
"""


def normalize_course_key(label):
    """Case- and spacing-insensitive course identity ("Physics  101" == "physics 101")."""
    return ' '.join((label or '').casefold().split())


def clip_items(items, limit, length):
    """First `limit` non-empty items, each cut to `length` characters, duplicates removed."""
    unique = dict.fromkeys(' '.join(str(item).split())[:length] for item in items)
    return [item for item in unique if item][:limit]
