"""
Regression tests for doubts asked during a pending understanding check.

WHY THIS FILE EXISTS:
    The grader must see the answer key to grade; the teacher who explains a doubt must never see
    it. These tests prove, from the outside, that the student-facing doubt reply is written by a
    model call whose input has no answer key, and that a reply which still reveals the answer is
    never shown or saved.
"""
import json
import uuid
from unittest.mock import Mock, patch
from django.contrib.auth import get_user_model
from django.test import SimpleTestCase, TestCase
from rest_framework.test import APIClient
from apps.classroom.models.lesson_attempt import LessonProgress
from apps.classroom.services.lecture_notes import save_lecture_note
from apps.classroom.services.lesson_answers import submit_lesson_answer
from apps.classroom.tests.lecture_note_fixtures import lesson_answer
from apps.classroom.utilities.answer_leak import reveals_expected_answer

EXPECTED = 'Current halves at constant voltage'
GRADER_DOUBT = json.dumps({'outcome': 'student_question', 'next_action': 'answer_question',
                           'feedback': f'{EXPECTED}. Try again.', 'missing_concepts': []})
SAFE_REPLY = json.dumps({'reply': 'Resistance is how strongly a material opposes charge flow, '
                                  'like a narrow pipe slowing water. Now try the check again.'})
LEAKING_REPLY = json.dumps({'reply': f'Good question. {EXPECTED}, so now answer the check.'})


def sent_payload(model):
    """Return the JSON human message from every invoke call made on a mocked model."""
    return [call.args[0][1].content for call in model.return_value.bind.return_value.invoke.call_args_list]


class PendingDoubtTests(TestCase):
    def setUp(self):
        user = get_user_model().objects.create_user(username='doubt-user', email='doubt@example.org')
        answer = lesson_answer()
        answer['chunks'][0].update(question='What happens if resistance doubles?', expected_concepts=[EXPECTED])
        self.note = save_lecture_note(user, 'doubt', answer)
        self.attempt = submit_lesson_answer(user, self.note.id, uuid.uuid4(), 0, 'What is resistance?')
        self.client = APIClient()
        self.client.force_authenticate(user)
        self.url = f'/api/notes/{self.note.id}/answers/{self.attempt.id}/evaluate/'

    @patch('apps.classroom.services.lesson_doubt.get_llm')
    @patch('apps.classroom.services.lesson_evaluation.get_llm')
    def test_doubt_reply_comes_from_a_model_that_never_saw_the_answer_key(self, grader, teacher):
        grader.return_value.bind.return_value.invoke.return_value = Mock(text=GRADER_DOUBT)
        teacher.return_value.bind.return_value.invoke.return_value = Mock(text=SAFE_REPLY)
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['evaluation']['next_action'], 'answer_question')
        self.assertTrue(response.data['evaluation']['feedback'].startswith('Resistance is how strongly'))
        for payload in sent_payload(teacher):
            self.assertNotIn(EXPECTED, payload)
            self.assertNotIn('expected_concepts', payload)

    @patch('apps.classroom.services.lesson_doubt.get_llm')
    @patch('apps.classroom.services.lesson_evaluation.get_llm')
    def test_grader_feedback_is_never_shown_for_a_doubt(self, grader, teacher):
        grader.return_value.bind.return_value.invoke.return_value = Mock(text=GRADER_DOUBT)
        teacher.return_value.bind.return_value.invoke.return_value = Mock(text=SAFE_REPLY)
        response = self.client.post(self.url)
        self.assertNotIn(EXPECTED, response.data['evaluation']['feedback'])
        self.attempt.refresh_from_db()
        self.assertNotIn(EXPECTED, self.attempt.evaluation['feedback'])

    @patch('apps.classroom.services.lesson_doubt.get_llm')
    @patch('apps.classroom.services.lesson_evaluation.get_llm')
    def test_reply_that_reveals_the_answer_is_retried_once_then_rejected(self, grader, teacher):
        grader.return_value.bind.return_value.invoke.return_value = Mock(text=GRADER_DOUBT)
        teacher.return_value.bind.return_value.invoke.return_value = Mock(text=LEAKING_REPLY)
        self.assertEqual(self.client.post(self.url).status_code, 503)
        self.assertEqual(len(sent_payload(teacher)), 2)
        self.attempt.refresh_from_db()
        self.assertEqual(self.attempt.evaluation, {})
        self.assertIsNone(self.attempt.evaluating_since)
        self.assertTrue(LessonProgress.objects.get(note=self.note).waiting)

    @patch('apps.classroom.services.lesson_doubt.get_llm')
    @patch('apps.classroom.services.lesson_evaluation.get_llm')
    def test_leaking_first_reply_is_replaced_by_a_safe_retry(self, grader, teacher):
        grader.return_value.bind.return_value.invoke.return_value = Mock(text=GRADER_DOUBT)
        teacher.return_value.bind.return_value.invoke.side_effect = [Mock(text=LEAKING_REPLY), Mock(text=SAFE_REPLY)]
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertNotIn(EXPECTED, response.data['evaluation']['feedback'])

    @patch('apps.classroom.services.lesson_doubt.get_llm', return_value=None)
    @patch('apps.classroom.services.lesson_evaluation.get_llm')
    def test_unavailable_teacher_keeps_the_check_pending(self, grader, teacher):
        grader.return_value.bind.return_value.invoke.return_value = Mock(text=GRADER_DOUBT)
        self.assertEqual(self.client.post(self.url).status_code, 503)
        self.attempt.refresh_from_db()
        self.assertEqual(self.attempt.evaluation, {})
        self.assertTrue(LessonProgress.objects.get(note=self.note).waiting)

    @patch('apps.classroom.services.lesson_doubt.get_llm')
    @patch('apps.classroom.services.lesson_evaluation.get_llm')
    def test_graded_answers_do_not_call_the_doubt_teacher(self, grader, teacher):
        grader.return_value.bind.return_value.invoke.return_value = Mock(
            text='{"outcome":"understood","next_action":"continue","feedback":"Correct.","missing_concepts":[]}')
        self.assertEqual(self.client.post(self.url).status_code, 200)
        teacher.assert_not_called()

    def test_doubt_payload_has_lesson_context_and_pending_question_but_no_answer_key(self):
        from apps.classroom.services.lesson_doubt import build_doubt_payload
        payload = build_doubt_payload(self.attempt)
        self.assertEqual(payload['pending_check'], 'What happens if resistance doubles?')
        self.assertEqual(payload['student_doubt'], 'What is resistance?')
        self.assertTrue(payload['lesson_context'])
        self.assertNotIn(EXPECTED, json.dumps(payload))
        self.assertNotIn('email', json.dumps(payload))


class AnswerLeakDetectorTests(SimpleTestCase):
    def test_reply_repeating_the_expected_answer_is_a_leak(self):
        self.assertTrue(reveals_expected_answer('So the current halves at constant voltage.', [EXPECTED], 'Q?'))

    def test_matching_ignores_case_punctuation_and_spacing(self):
        self.assertTrue(reveals_expected_answer('CURRENT  halves, at constant-voltage!', [EXPECTED], 'Q?'))

    def test_reply_without_the_expected_answer_is_safe(self):
        self.assertFalse(reveals_expected_answer('Resistance opposes charge flow.', [EXPECTED], 'Q?'))

    def test_concept_already_written_in_the_question_is_not_a_leak(self):
        self.assertFalse(reveals_expected_answer('Think about voltage.', ['voltage'], 'Which quantity, like voltage, stays fixed?'))

    def test_half_of_several_concepts_is_a_leak(self):
        concepts = ['superior colliculus', 'inferior colliculus', 'substantia nigra', 'red nucleus']
        self.assertTrue(reveals_expected_answer('The superior colliculus and red nucleus...', concepts, 'Q?'))
        self.assertFalse(reveals_expected_answer('The superior colliculus helps vision.', concepts, 'Q?'))

    def test_empty_concepts_never_leak(self):
        self.assertFalse(reveals_expected_answer('Anything.', [], 'Q?'))


class SpokenSectionsTests(SimpleTestCase):
    def test_returns_only_spoken_text_in_range_and_truncates(self):
        from apps.classroom.utilities.lesson_context import spoken_sections
        chunks = [{'speak': 'one'}, {'speak': 'two', 'expected_concepts': ['key']}, {'diagram': {}}, {'speak': 'four'}]
        self.assertEqual(spoken_sections(chunks, 0, 4), ['one', 'two', 'four'])
        self.assertEqual(spoken_sections(chunks, -3, 2, max_length=2), ['on', 'tw'])
        self.assertEqual(spoken_sections(chunks, 5, 9), [])
