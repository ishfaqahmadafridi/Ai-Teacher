"""Bounded new-lesson structure and review contracts."""
from .research import research_budget

LESSON_MODES = ('lesson', 'focused', 'clarification', 'quiz')
TEACHING_STEPS = ('introduction', 'explanation', 'example', 'practice', 'discussion', 'recap')
QUALITY_CHECKS = ('request_fit', 'small_concepts', 'connections', 'subject_depth',
                  'examples', 'accuracy', 'visual_alignment', 'assessment')
QUALITY_ATTEMPTS = research_budget('CLASSROOM_QUALITY_ATTEMPTS', 3, maximum=5)
# A full lesson must teach, not summarise: deterministic floor checked before AI review.
LESSON_MIN_CONCEPT_BLOCKS = research_budget('CLASSROOM_LESSON_MIN_CONCEPT_BLOCKS', 3, maximum=12)
LESSON_MIN_WORDS = research_budget('CLASSROOM_LESSON_MIN_WORDS', 600, maximum=5000)
QUALITY_REVIEW_TOKENS = research_budget('CLASSROOM_QUALITY_REVIEW_TOKENS', 4096, maximum=8192)
QUALITY_MAX_FINDINGS = len(QUALITY_CHECKS)
QUALITY_REASON_LENGTH = 500
QUALITY_QUOTE_LENGTH = 1000
CONCEPT_ID_LENGTH = 64

QUALITY_REPAIR_FEEDBACK_LENGTH = 4000
QUALITY_LOG_REASON_LENGTH = 500

QUALITY_EVIDENCE_STEPS = {'small_concepts': 'explanation', 'examples': 'example', 'assessment': 'practice'}
