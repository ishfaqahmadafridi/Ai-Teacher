"""Attach optional research without making evidence infrastructure mandatory."""
import json
from apps.classroom.agents.research import research_evidence
from apps.classroom.prompts.research_prompt import RESEARCH_CONTEXT


def build_research_context(question):
    try:
        result = research_evidence(question)
    except Exception:
        # Failure details may include credentials; expose only a generic status.
        result = {'evidence': [], 'errors': ['research']}
    sources = [{**item, 'number': i + 1} for i, item in enumerate(result['evidence'])]
    return RESEARCH_CONTEXT.format(evidence=json.dumps(sources)), {
        'sources': sources,
        'research_unavailable': result['errors'],
        'research_status': 'available' if sources else 'unavailable',
    }
