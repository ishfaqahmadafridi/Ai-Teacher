"""Server-only configuration for the optional Groq quota fallback."""
import os
from . import LLM_TIMEOUT
GROQ_CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions'
# llama-3.3-70b-versatile was retired by Groq (404); honour the shared GROQ_MODEL setting.
GROQ_MODEL = os.getenv('CLASSROOM_GROQ_MODEL') or os.getenv('GROQ_MODEL') or 'openai/gpt-oss-120b'
GROQ_TIMEOUT = LLM_TIMEOUT
# Reasoning models spend completion tokens on thinking; leave room for a full lesson.
GROQ_MAX_TOKENS = 16384
# Gemini quota (429) and temporary overload (503) both move the request to Groq.
FALLBACK_STATUS_CODES = frozenset({429, 503})

# Reported in lesson metadata when the primary model answers; the Groq fallback reports 'groq'.
PRIMARY_PROVIDER = 'gemini'
