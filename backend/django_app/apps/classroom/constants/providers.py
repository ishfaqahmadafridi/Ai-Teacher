"""Server-only configuration for the optional Groq quota fallback."""
import os
from . import LLM_TIMEOUT
GROQ_CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions'
GROQ_MODEL = os.getenv('CLASSROOM_GROQ_MODEL', 'llama-3.3-70b-versatile')
GROQ_TIMEOUT = LLM_TIMEOUT
GROQ_MAX_TOKENS = 4096
