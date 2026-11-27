"""Assessment budgets and shared lesson validation limits."""
import os
from apps.classroom.constants.research import research_budget
EVALUATION_MAX_TOKENS = research_budget('LESSON_EVALUATION_MAX_TOKENS', 2048, maximum=4096)
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
    'student_question': 'answer_question',
}
LESSON_OUTCOMES_WITHOUT_GAPS = frozenset({'understood', 'student_question'})
EVALUATION_CONTEXT_SECTIONS = 3
EVALUATION_CONTEXT_TEXT_MAX_LENGTH = 1200

DISCUSSION_WINDOW_SECONDS = research_budget('CLASSROOM_DISCUSSION_SECONDS', 30, maximum=120)
DISCUSSION_MAX_TOKENS = research_budget('CLASSROOM_DISCUSSION_MAX_TOKENS', 2048, maximum=4096)
DISCUSSION_CONTEXT_SECTIONS = 2

# Doubt asked during a pending check: written by a teacher call that never sees the answer key.
DOUBT_MAX_TOKENS = research_budget('CLASSROOM_DOUBT_MAX_TOKENS', 2048, maximum=4096)
DOUBT_TEMPERATURE = 0.3
DOUBT_LEAK_ATTEMPTS = 2
DOUBT_OUTCOME = 'student_question'

# Course memory: what the teacher is told about this student's previous classes in the same course.
# Built by code from saved records (notes, graded attempts, progress); never by a model.
COURSE_MEMORY_CLASSES = 2
COURSE_MEMORY_NOTE_SCAN = 20
COURSE_MEMORY_ITEMS = 3
COURSE_MEMORY_TEXT_LENGTH = 120
COURSE_MEMORY_WEAK_OUTCOMES = frozenset({'misconception', 'unclear'})
COURSE_MEMORY_GRADED_OUTCOMES = COURSE_MEMORY_WEAK_OUTCOMES | {'understood'}
COURSE_MEMORY_DOUBT_OUTCOME = 'student_question'

# Lesson job inputs added by the server (never by the client); retries compare only client inputs.
SERVER_SUPPLIED_INPUTS = frozenset({'student_context', 'curriculum', 'course_memory'})
