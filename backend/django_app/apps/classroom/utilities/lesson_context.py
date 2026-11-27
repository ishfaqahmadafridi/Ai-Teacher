"""
apps/classroom/utilities/lesson_context.py

Spoken text of a range of lesson sections, for prompts that need lesson context.

WHY A SEPARATE UTILITY:
    Least privilege for model calls: grading, doubt and Q&A replies need what the teacher said,
    never whole chunks (which also carry answer keys and visual metadata). One function keeps
    that rule in one place.
"""


def spoken_sections(chunks, start, stop, max_length=None):
    """Spoken text of chunks[start:stop], optionally truncated per section; empty sections skipped."""
    return [chunk['speak'][:max_length] for chunk in chunks[max(0, start):stop] if chunk.get('speak')]
