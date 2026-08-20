"""
teacher/services/session_service.py

In-process session store for conversation history.

WHY A SEPARATE SERVICE:
    Isolating the session store here means swapping to Redis in production
    requires changing only this file — inference.py and views.py are untouched.

PRODUCTION NOTE:
    Replace the dict below with Django's cache framework:
        from django.core.cache import cache
        cache.set(f'session:{session_id}', history, timeout=3600)
        history = cache.get(f'session:{session_id}', [])
"""

import threading

# In-memory store: session_id -> list of {role, content} dicts
# Thread-safe for single-process development. Use Redis in production.
_sessions: dict[str, list[dict]] = {}
_lock = threading.Lock()

# Maximum message pairs to retain per session (prevents unbounded growth)
MAX_HISTORY_LENGTH = 40


def get_session(session_id: str) -> list[dict]:
    """Return the conversation history for the given session, creating it if absent."""
    with _lock:
        if session_id not in _sessions:
            _sessions[session_id] = []
        return _sessions[session_id]


def save_session(session_id: str, history: list[dict]) -> None:
    """Persist the updated history, capping it to MAX_HISTORY_LENGTH entries."""
    with _lock:
        _sessions[session_id] = history[-MAX_HISTORY_LENGTH:]


def clear_session(session_id: str) -> None:
    """Remove conversation history for the given session ID."""
    with _lock:
        _sessions.pop(session_id, None)
