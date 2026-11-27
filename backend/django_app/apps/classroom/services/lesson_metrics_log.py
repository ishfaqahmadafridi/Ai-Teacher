"""
apps/classroom/services/lesson_metrics_log.py

One structured log record per finished lesson, for monitoring cost, speed and quality.

WHY A SEPARATE SERVICE:
    Lesson metadata (provider, tokens, review attempts, subject, prompt budget) was produced but
    never reported together, so cost spikes, fallbacks and slow lessons were invisible. One
    function owns the record's shape so dashboards and alerts can rely on stable field names.

PRIVACY:
    Only operational numbers and IDs of the job; never the question, lesson text or student
    identity (AI rule AI-3).
"""
import json
import logging

logger = logging.getLogger(__name__)


def lesson_metrics(result, elapsed_seconds, queue_wait_seconds):
    """Stable, content-free metrics for one generated lesson."""
    info = result.get('model_info', {})
    quality = info.get('teaching_quality', {})
    budget = info.get('prompt_budget', {})
    chunks = result.get('chunks', [])
    return {
        'provider': info.get('provider'),
        'model': info.get('model_type'),
        'subjects': info.get('subjects', []),
        'previous_classes_used': info.get('previous_classes_used', 0),
        'quality_passed': quality.get('passed'),
        'quality_attempts': quality.get('attempts'),
        'tokens_total': result.get('tokens_used', 0),
        'provider_input_tokens': budget.get('provider_input_tokens'),
        'provider_output_tokens': budget.get('provider_output_tokens'),
        'history_messages_dropped': budget.get('history_messages_dropped', 0),
        'references_trimmed': budget.get('references_trimmed', False),
        'sections': len(chunks),
        'words': sum(len(chunk.get('speak', '').split()) for chunk in chunks),
        'curriculum_verified': info.get('curriculum_verified', False),
        'elapsed_seconds': round(elapsed_seconds, 2),
        'queue_wait_seconds': round(queue_wait_seconds, 2),
    }


def log_lesson_metrics(job_id, result, elapsed_seconds, queue_wait_seconds):
    """Write the metrics as one JSON log line, searchable by `lesson_metrics`."""
    record = {'job': str(job_id), **lesson_metrics(result, elapsed_seconds, queue_wait_seconds)}
    logger.info('lesson_metrics %s', json.dumps(record, sort_keys=True))
    return record
