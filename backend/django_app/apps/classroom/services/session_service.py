"""Database-backed conversation history shared across Django workers."""
from apps.classroom.constants import MAX_HISTORY_LENGTH
from apps.classroom.models import ClassroomSession
from django.db import transaction


def get_session(session_id: str) -> list[dict]:
    """Read history without creating records for unused sessions."""
    return ClassroomSession.objects.filter(session_id=session_id).values_list(
        "history", flat=True
    ).first() or []


def save_session(session_id: str, history: list[dict]) -> None:
    """Persist a bounded history without retaining references to caller data."""
    if MAX_HISTORY_LENGTH <= 0:
        raise ValueError("CLASSROOM_HISTORY_LIMIT must be positive")
    ClassroomSession.objects.update_or_create(
        session_id=session_id, defaults={"history": history[-MAX_HISTORY_LENGTH:]}
    )


def clear_session(session_id: str) -> None:
    """Delete the stored history for a session."""
    ClassroomSession.objects.filter(session_id=session_id).delete()


def append_session(session_id: str, entries: list[dict]) -> None:
    """Append a completed turn without overwriting concurrent completed turns."""
    if MAX_HISTORY_LENGTH <= 0:
        raise ValueError("CLASSROOM_HISTORY_LIMIT must be positive")
    with transaction.atomic():
        session, _ = ClassroomSession.objects.get_or_create(session_id=session_id)
        session = ClassroomSession.objects.select_for_update().get(pk=session.pk)
        session.history = (session.history + entries)[-MAX_HISTORY_LENGTH:]
        session.save(update_fields=["history", "updated_at"])
