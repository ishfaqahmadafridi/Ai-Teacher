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

_llm = None


def get_llm(temperature: float = 0.7):
    """
    Lazily initialise the Gemini 2.5 Flash LLM (singleton).
    Returns a LangChain ChatGoogleGenerativeAI instance.
    """
    from langchain_google_genai import ChatGoogleGenerativeAI
    global _llm
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        logger.warning('GEMINI_API_KEY not set in environment.')
    if _llm is None:
        _llm = ChatGoogleGenerativeAI(
            model='gemini-2.5-flash',
            google_api_key=api_key,
            temperature=temperature,
        )
    return _llm


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
