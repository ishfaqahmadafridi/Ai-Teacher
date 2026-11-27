"""
Operational quality: speakable replies and content-free lesson metrics.

WHY THESE TESTS:
    Spoken replies must not contain symbols read aloud, and monitoring must report cost, speed
    and quality without ever logging lesson text or student identity.
"""
import json
from django.test import SimpleTestCase
from apps.classroom.services.lesson_metrics_log import lesson_metrics, log_lesson_metrics
from apps.classroom.utilities.spoken_text import speakable


class SpeakableTextTests(SimpleTestCase):
    def test_paired_emphasis_code_and_headings_are_removed(self):
        self.assertEqual(speakable('Find the *two* roots, **not** one.'), 'Find the two roots, not one.')
        self.assertEqual(speakable('Use `b^2 - 4ac` here.'), 'Use b^2 - 4ac here.')
        self.assertEqual(speakable('## Summary\nRoots are real.'), 'Summary\nRoots are real.')
        self.assertEqual(speakable('A ***very*** _key_ idea'), 'A very key idea')

    def test_multiplication_and_plain_text_are_unchanged(self):
        for text in ['D = b*b - 4 * a * c', '5 * 3 = 15', 'snake_case stays', 'Plain sentence.']:
            with self.subTest(text=text):
                self.assertEqual(speakable(text), text)


class LessonMetricsTests(SimpleTestCase):
    RESULT = {'tokens_used': 12742, 'chunks': [{'speak': 'one two three', 'question': 'secret question?'}, {'speak': 'four'}],
              'model_info': {'provider': 'gemini', 'model_type': 'gemini-2.5-flash', 'subjects': ['mathematics'],
                             'previous_classes_used': 1, 'curriculum_verified': True,
                             'teaching_quality': {'passed': True, 'attempts': 1},
                             'prompt_budget': {'provider_input_tokens': 9000, 'provider_output_tokens': 3700,
                                               'history_messages_dropped': 0, 'references_trimmed': False}}}

    def test_metrics_report_cost_speed_quality_and_subject(self):
        metrics = lesson_metrics(self.RESULT, 41.234, 2.5)
        self.assertEqual(metrics['subjects'], ['mathematics'])
        self.assertEqual((metrics['quality_passed'], metrics['quality_attempts']), (True, 1))
        self.assertEqual((metrics['sections'], metrics['words'], metrics['tokens_total']), (2, 4, 12742))
        self.assertEqual(metrics['elapsed_seconds'], 41.23)

    def test_missing_metadata_does_not_break_monitoring(self):
        metrics = lesson_metrics({'chunks': []}, 1, 0)
        self.assertEqual((metrics['words'], metrics['tokens_total'], metrics['subjects']), (0, 0, []))

    def test_log_line_never_contains_lesson_text(self):
        with self.assertLogs('apps.classroom.services.lesson_metrics_log', level='INFO') as logs:
            record = log_lesson_metrics('job-1', self.RESULT, 10, 1)
        line = logs.output[0]
        self.assertIn('lesson_metrics', line)
        self.assertNotIn('secret question', line)
        self.assertNotIn('one two three', line)
        self.assertEqual(json.loads(line.split('lesson_metrics ', 1)[1])['job'], record['job'])


class TeachingEvaluationTests(SimpleTestCase):
    """The evaluation harness itself, with a fake pipeline (never a real provider)."""

    @staticmethod
    def fake_generate(topic, **kwargs):
        course = (kwargs.get('curriculum') or {}).get('course', '')
        subject = 'mathematics' if 'Mathematics' in course else 'physics'
        return {'topic': topic, 'tokens_used': 1000, 'chunks': [{'speak': 'word ' * 140}],
                'model_info': {'subjects': [subject], 'teaching_quality': {'passed': True, 'attempts': 2}}}

    def test_rows_and_summary_report_quality_size_cost_and_subject_accuracy(self):
        from apps.classroom.services.teaching_evaluation import run_teaching_evaluation
        rows, summary = run_teaching_evaluation(self.fake_generate, limit=2)
        self.assertEqual([row['subject_correct'] for row in rows], [False, True])
        self.assertEqual(rows[1]['minutes'], 1.0)
        self.assertEqual(summary['topics'], 2)
        self.assertEqual(summary['subject_accuracy'], 0.5)
        self.assertEqual(summary['quality_pass_rate'], 1.0)
        self.assertEqual((summary['fallbacks'], summary['avg_tokens'], summary['avg_review_attempts']), (0, 1000, 2.0))

    def test_failed_or_unknown_lessons_count_as_fallbacks(self):
        from apps.classroom.services.teaching_evaluation import evaluate_topic
        row = evaluate_topic(lambda topic, **kwargs: {'topic': 'unknown', 'chunks': []}, 'X', '', 'general')
        self.assertTrue(row['fallback'])

    def test_course_topics_are_sent_as_scheduled_scope_and_ad_hoc_ones_are_not(self):
        from apps.classroom.services.teaching_evaluation import evaluation_curriculum
        self.assertEqual(evaluation_curriculum('Binary search', 'BSCS')['course'], 'BSCS')
        self.assertIsNone(evaluation_curriculum('Binary search', ''))
