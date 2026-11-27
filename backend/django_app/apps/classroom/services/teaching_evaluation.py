"""
apps/classroom/services/teaching_evaluation.py

Run the fixed evaluation set through the real lesson pipeline and summarise the results.

WHY A SERVICE (the command only prints):
    Measurement must be repeatable and testable: the same topics, the same metrics
    (lesson_metrics), and a summary that shows pass rate, fallbacks, wrong subject selection,
    size, tokens and time. Every prompt/model/profile change is compared against it.
"""
import time
import uuid
from apps.classroom.constants.teaching_evaluation import TEACHING_EVALUATION_SET, WORDS_PER_SPOKEN_MINUTE
from apps.classroom.services.lesson_metrics_log import lesson_metrics


def evaluation_curriculum(topic, course):
    """A scheduled-class scope for course topics, so the course label selects the subject."""
    if not course:
        return None
    return {'session_id': str(uuid.uuid4()), 'course': course, 'topic': topic, 'week': 1, 'session_kind': 'lesson',
            'requirements': [{'id': 'topic', 'kind': 'topic', 'label': topic}]}


def evaluate_topic(generate, topic, course, expected_subject):
    """One lesson through `generate` (the real pipeline in production use), as a metrics row."""
    started = time.monotonic()
    result = generate(topic, session_id=f'evaluation-{uuid.uuid4()}', persist_history=False,
                      curriculum=evaluation_curriculum(topic, course))
    metrics = lesson_metrics(result, time.monotonic() - started, 0)
    return {'topic': topic, 'expected_subject': expected_subject,
            'subject_correct': metrics['subjects'] == [expected_subject],
            'fallback': result.get('topic') == 'unknown' or not metrics['quality_passed'],
            'minutes': round(metrics['words'] / WORDS_PER_SPOKEN_MINUTE, 1), **metrics}


def summarise(rows):
    """Pass rate, fallbacks, subject accuracy and averages across the evaluated topics."""
    count = len(rows) or 1
    return {
        'topics': len(rows),
        'quality_pass_rate': round(sum(bool(row['quality_passed']) for row in rows) / count, 2),
        'fallbacks': sum(row['fallback'] for row in rows),
        'subject_accuracy': round(sum(row['subject_correct'] for row in rows) / count, 2),
        'avg_words': round(sum(row['words'] for row in rows) / count),
        'avg_tokens': round(sum(row['tokens_total'] for row in rows) / count),
        'avg_seconds': round(sum(row['elapsed_seconds'] for row in rows) / count, 1),
        'avg_review_attempts': round(sum(row['quality_attempts'] or 0 for row in rows) / count, 2),
    }


def run_teaching_evaluation(generate, limit=None):
    """Evaluate the first `limit` topics (all by default); returns (rows, summary)."""
    rows = [evaluate_topic(generate, *case) for case in TEACHING_EVALUATION_SET[:limit]]
    return rows, summarise(rows)
