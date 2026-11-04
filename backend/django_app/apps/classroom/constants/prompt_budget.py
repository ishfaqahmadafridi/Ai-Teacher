"""Operational context caps, not claims about a provider's advertised capacity."""
from .research import research_budget

CONTEXT_TOKENS = research_budget('CLASSROOM_CONTEXT_TOKENS', 32768, maximum=2000000)
OUTPUT_TOKENS = research_budget('CLASSROOM_OUTPUT_TOKENS', 8192, maximum=65536)
HISTORY_TOKENS = research_budget('CLASSROOM_HISTORY_TOKENS', 4096, maximum=100000)
REFERENCE_TOKENS = research_budget('CLASSROOM_REFERENCE_TOKENS', 8192, maximum=100000)
GROQ_CONTEXT_TOKENS = research_budget('CLASSROOM_GROQ_CONTEXT_TOKENS', 32768, maximum=2000000)
TOKEN_MARGIN = 1024
TOKEN_CHARS = 1.0
MESSAGE_OVERHEAD = 16
