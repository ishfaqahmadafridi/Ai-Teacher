"""Classroom LLM initialization, JSON parsing, and fallback responses."""

import os
import json
import logging
import threading
from functools import lru_cache

from apps.classroom.constants import (
    DEFAULT_TEMPERATURE, GEMINI_MODEL, LLM_MAX_RETRIES, LLM_TIMEOUT, LLM_CACHE_SIZE, FALLBACK_SPEECH,
)

logger = logging.getLogger(__name__)

_llm_lock = threading.Lock()


@lru_cache(maxsize=LLM_CACHE_SIZE)
def _create_llm(api_key: str, model: str, temperature: float):
    from langchain_google_genai import ChatGoogleGenerativeAI
    return ChatGoogleGenerativeAI(
        model=model, google_api_key=api_key, temperature=temperature,
        max_retries=LLM_MAX_RETRIES, request_timeout=LLM_TIMEOUT,
    )


def get_llm(temperature: float = DEFAULT_TEMPERATURE):
    """Initialize the configured model through a bounded standard-library cache."""
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        logger.warning("Gemini API key unavailable; using offline fallback")
        return None
    try:
        with _llm_lock:
            return _create_llm(api_key, GEMINI_MODEL, temperature)
    except Exception:
        logger.exception("Failed to initialize classroom LLM")
        return None


def extract_json(raw: str) -> dict:
    """
    Extract and parse the JSON object from Gemini's raw response string.

    Gemini sometimes wraps JSON in markdown fences — this strips them.
    Returns the parsed dict, or raises ValueError if parsing fails.
    """
    if not isinstance(raw, str):
        raise ValueError("LLM response must contain text")
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        pass
    else:
        if not isinstance(parsed, dict):
            raise ValueError("LLM response must be a JSON object")
        return parsed
    decoder = json.JSONDecoder()
    # raw_decode handles braces inside strings and surrounding markdown/prose.
    for index, character in enumerate(raw):
        if character != "{":
            continue
        try:
            parsed, _ = decoder.raw_decode(raw[index:])
        except json.JSONDecodeError:
            continue
        if isinstance(parsed, dict):
            return parsed
    raise ValueError("LLM response does not contain a valid JSON object")


def fallback_chunks(question: str) -> dict:
    """
    Return a safe fallback response when Gemini fails or returns invalid JSON.
    Ensures the frontend always receives a valid chunks array.
    """
    return {
        'chunks': [
            {
                'speak': FALLBACK_SPEECH,
                'diagram': {'action': 'none'},
            }
        ],
        'topic': 'unknown',
        'diagram_type': 'default',
        'language': 'en',
    }
