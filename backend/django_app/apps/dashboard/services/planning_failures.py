"""Classify provider failures, including exceptions wrapped by LangChain."""
from datetime import timedelta
from random import uniform
from django.conf import settings
from django.utils import timezone
from google.genai.errors import APIError
from httpx import TransportError


def is_transient(error):
    seen = set()
    while error is not None and id(error) not in seen:
        seen.add(id(error))
        if isinstance(error, (TimeoutError, ConnectionError, TransportError)):
            return True
        if isinstance(error, APIError):
            return error.code == 429 or error.code >= 500
        error = error.__cause__ or error.__context__
    return False


def failure_update(error, attempts):
    transient = is_transient(error)
    retry = transient and attempts < settings.TIMETABLE_MAX_ATTEMPTS
    now = timezone.now()
    delay = settings.TIMETABLE_RETRY_BASE_SECONDS * 2 ** (attempts - 1)
    return {
        "updated_at": now,
        "status": "queued" if retry else "failed",
        "next_attempt_at": now + timedelta(seconds=delay + uniform(0, settings.TIMETABLE_RETRY_BASE_SECONDS)) if retry else None,
        "error": "" if retry else (
            "The planning provider is unavailable. Please retry." if transient else
            "Unable to generate a valid plan. Check your availability and try again."
        ),
    }
