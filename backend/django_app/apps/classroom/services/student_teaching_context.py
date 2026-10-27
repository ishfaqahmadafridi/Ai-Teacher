"""Trusted teaching level from the account, without personal identifiers."""
from apps.dashboard.constants.outline_level_policies import OUTLINE_LEVEL_POLICIES


def student_teaching_context(user):
    level = (user.education_level or '').strip().lower().replace(' ', '_').replace('-', '_')
    label, guidance = OUTLINE_LEVEL_POLICIES.get(level, ('Unspecified', 'Explain prerequisites and start accessibly; do not assume advanced knowledge.'))
    return dict(level=label, guidance=guidance, academic_year=user.academic_year,
                grade=user.grade_level, language=user.preferred_language)
