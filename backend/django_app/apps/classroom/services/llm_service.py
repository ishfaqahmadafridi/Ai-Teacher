"""
teacher/services/llm_service.py

LLM initialisation, JSON extraction, and fallback response construction
for the teacher (ask) feature.

Separated from inference.py so each concern is independently testable.
"""

import os
import re
import json
import logging

logger = logging.getLogger(__name__)

_llm_cache: dict = {}


def get_llm(temperature: float = 0.7):
    """
    Lazily initialise the Gemini 2.5 Flash LLM (cached per temperature).
    Returns a LangChain ChatGoogleGenerativeAI instance.
    """
    from langchain_google_genai import ChatGoogleGenerativeAI
    global _llm_cache

    api_key = os.getenv('GEMINI_API_KEY') or os.getenv('GOOGLE_API_KEY')
    if not api_key:
        logger.warning('GEMINI_API_KEY not set in environment. Returning None for offline fallback.')
        return None

    cache_key = (api_key, temperature)
    if cache_key not in _llm_cache:
        try:
            _llm_cache[cache_key] = ChatGoogleGenerativeAI(
                model='gemini-2.5-flash',
                google_api_key=api_key,
                temperature=temperature,
                max_retries=2,
                request_timeout=30.0,
            )
        except Exception as e:
            logger.error(f"[LLM Service] Failed to initialize Gemini model: {e}")
            return None
    return _llm_cache.get(cache_key)


def extract_json(raw: str) -> dict:
    """
    Extract and parse the JSON object from Gemini's raw response string.

    Gemini sometimes wraps JSON in markdown fences — this strips them.
    Returns the parsed dict, or raises ValueError if parsing fails.
    """
    cleaned = re.sub(r'```(?:json)?\s*', '', raw).replace('```', '').strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    start = cleaned.find('{')
    end = cleaned.rfind('}')
    if start != -1 and end != -1:
        try:
            return json.loads(cleaned[start: end + 1])
        except json.JSONDecodeError:
            pass

    raise ValueError(f'Could not parse JSON from Gemini response: {raw[:200]}')


def fallback_chunks(question: str) -> dict:
    """
    Return a safe fallback response when Gemini fails or returns invalid JSON.
    Ensures the frontend always receives a valid chunks array.
    """
    return {
        'chunks': [
            {
                'speak': (
                    'I am having a little technical difficulty right now. '
                    'Please ask your question again and I will explain it properly.'
                ),
                'diagram': {'action': 'none'},
            }
        ],
        'topic': 'unknown',
        'diagram_type': 'default',
        'language': 'en',
    }
