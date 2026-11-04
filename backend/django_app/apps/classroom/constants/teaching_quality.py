"""Bounded new-lesson structure and review contracts."""
from .research import research_budget

LESSON_MODES = ('lesson', 'focused', 'clarification', 'quiz')
TEACHING_STEPS = ('introduction', 'explanation', 'example', 'practice', 'discussion', 'recap')
QUALITY_CHECKS = ('request_fit', 'small_concepts', 'connections', 'subject_depth',
                  'examples', 'accuracy', 'visual_alignment', 'assessment')
QUALITY_ATTEMPTS = 2
QUALITY_REVIEW_TOKENS = research_budget('CLASSROOM_QUALITY_REVIEW_TOKENS', 4096, maximum=8192)
QUALITY_MAX_FINDINGS = len(QUALITY_CHECKS)
QUALITY_REASON_LENGTH = 500
QUALITY_QUOTE_LENGTH = 1000
CONCEPT_ID_LENGTH = 64

QUALITY_REPAIR_FEEDBACK_LENGTH = 4000

QUALITY_EVIDENCE_STEPS = {'small_concepts': 'explanation', 'examples': 'example', 'assessment': 'practice'}
