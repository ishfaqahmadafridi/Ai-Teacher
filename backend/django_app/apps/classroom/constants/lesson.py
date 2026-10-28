"""Assessment budgets and shared lesson validation limits."""
import os
from apps.classroom.constants.research import research_budget
EVALUATION_MAX_TOKENS = research_budget('LESSON_EVALUATION_MAX_TOKENS', 1024, maximum=4096)
EVALUATION_LEASE_SECONDS = research_budget('LESSON_EVALUATION_LEASE_SECONDS', 180, maximum=600)
EVALUATION_MODEL = os.getenv('LESSON_EVALUATION_MODEL', 'gemini-2.5-flash-lite')

LESSON_TEXT_MAX_LENGTH = 2000
LESSON_CONCEPT_MAX_LENGTH = 500
LESSON_MAX_CONCEPTS = 10
LESSON_FEEDBACK_MAX_LENGTH = 4000
CURRICULUM_ID_MAX_LENGTH = 64
CURRICULUM_MAX_REQUIREMENTS = 100
CURRICULUM_EVIDENCE_MAX_LENGTH = 16000
LESSON_EVALUATION_ACTIONS = {
    'understood': 'continue',
    'misconception': 'reteach',
    'unclear': 'clarify',
}
