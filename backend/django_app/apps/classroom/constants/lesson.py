"""Configurable limits for answer assessment."""
import os
from apps.classroom.constants.research import research_budget
EVALUATION_MAX_TOKENS = research_budget('LESSON_EVALUATION_MAX_TOKENS', 1024, maximum=4096)
EVALUATION_LEASE_SECONDS = research_budget('LESSON_EVALUATION_LEASE_SECONDS', 180, maximum=600)
EVALUATION_MODEL = os.getenv('LESSON_EVALUATION_MODEL', 'gemini-2.5-flash-lite')
