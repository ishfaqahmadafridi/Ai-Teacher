"""Offline speech bounds for local development."""
import os
from apps.classroom.constants.research import research_budget
AUDIO_TIMEOUT_SECONDS = research_budget('CLASSROOM_TTS_TIMEOUT_SECONDS', 15, maximum=30)
AUDIO_MAX_CHARACTERS = research_budget('CLASSROOM_TTS_MAX_CHARACTERS', 4000, maximum=8000)
AUDIO_MAX_BYTES = 4000000
AUDIO_CACHE_SECONDS = 86400
AUDIO_REQUEST_RATE = os.getenv('CLASSROOM_TTS_REQUEST_RATE', '30/min')
