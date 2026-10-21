"""Rubric contracts, durable reuse and provider failure behavior."""
from unittest.mock import patch, Mock
import uuid
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.classroom.tests.lecture_note_fixtures import lesson_answer
from apps.classroom.services.lecture_notes import save_lecture_note
from apps.classroom.services.lesson_answers import submit_lesson_answer


class LessonEvaluationTests(TestCase):
    def setUp(self):
        user = get_user_model().objects.create_user(username='evaluation-user', email='evaluation@example.org')
        answer = lesson_answer()
        answer['chunks'][0].update(question='What happens if resistance doubles?', expected_concepts=['Current halves at constant voltage'])
        self.note = save_lecture_note(user, 'evaluation', answer)
        self.attempt = submit_lesson_answer(user, self.note.id, uuid.uuid4(), 0, 'It halves.')
        self.client = APIClient()
        self.client.force_authenticate(user)
        self.url = f'/api/notes/{self.note.id}/answers/{self.attempt.id}/evaluate/'

    @patch('apps.classroom.services.lesson_evaluation.get_llm')
    def test_evaluation_is_saved_and_reused(self, provider):
        provider.return_value.bind.return_value.invoke.return_value = Mock(text='{"outcome":"understood","next_action":"continue","feedback":"Correct at constant voltage.","missing_concepts":[]}')
        first = self.client.post(self.url)
        self.assertEqual(first.status_code, 200)
        second = self.client.post(self.url)
        self.assertEqual(first.data['evaluation'], second.data['evaluation'])
        provider.assert_called_once()

    @patch('apps.classroom.services.lesson_evaluation.get_llm')
    def test_inconsistent_evaluation_is_not_saved(self, provider):
        provider.return_value.bind.return_value.invoke.return_value = Mock(text='{"outcome":"understood","next_action":"reteach","feedback":"Correct.","missing_concepts":[]}')
        self.assertEqual(self.client.post(self.url).status_code, 503)
        self.attempt.refresh_from_db()
        self.assertEqual(self.attempt.evaluation, {})
        self.assertIsNone(self.attempt.evaluating_since)

    @patch('apps.classroom.services.lesson_evaluation.get_llm', return_value=None)
    def test_provider_failure_retains_student_answer(self, provider):
        self.assertEqual(self.client.post(self.url).status_code, 503)
        self.attempt.refresh_from_db()
        self.assertEqual(self.attempt.answer, 'It halves.')

    def test_another_account_cannot_evaluate(self):
        other = get_user_model().objects.create_user(username='evaluation-other', email='evaluation-other@example.org')
        self.client.force_authenticate(other)
        self.assertEqual(self.client.post(self.url).status_code, 404)
