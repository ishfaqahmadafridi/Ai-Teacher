"""Bounded note translation costs and document export configuration."""
import os
from apps.classroom.constants.research import research_budget

TRANSLATION_MAX_CHARACTERS = research_budget('NOTES_TRANSLATION_MAX_CHARACTERS', 12000, maximum=24000)
TRANSLATION_MAX_TOKENS = research_budget('NOTES_TRANSLATION_MAX_TOKENS', 4096, maximum=8192)
TRANSLATION_LEASE_SECONDS = research_budget('NOTES_TRANSLATION_LEASE_SECONDS', 180, maximum=600)
DOCX_CONTENT_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

FIGURE_MAX_BYTES = 2000000
FIGURE_MAX_DIMENSION = 4096

NOTES_PAGE_SIZE = 50
TRANSLATION_REQUEST_RATE = os.getenv('NOTES_TRANSLATION_REQUEST_RATE', '3/min')

TRANSLATION_MODEL = os.getenv('NOTES_TRANSLATION_MODEL', 'gemini-2.5-flash-lite')

ACCOUNT_SESSION_PREFIX = 'account:'
