"""
teacher/tests/test_views.py

Tests for the teacher app API endpoints (AskView, ClearSessionView, HealthView).
LLM and RAG are mocked — no external network calls are made.
"""

from unittest.mock import patch
from django.test import TestCase


class HealthViewTests(TestCase):
    """GET /api/health/"""

    def test_health_returns_200(self):
        response = self.client.get('/api/health/')
        self.assertEqual(response.status_code, 200)

    def test_health_response_has_status_and_model(self):
        response = self.client.get('/api/health/')
        data = response.json()
        self.assertIn('status', data)
        self.assertIn('model', data)
        self.assertEqual(data['status'], 'ready')


class AskViewTests(TestCase):
    """POST /api/ask/"""

    def test_missing_question_returns_400(self):
        response = self.client.post(
            '/api/ask/',
            data={},
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 400)

    def test_empty_question_returns_400(self):
        response = self.client.post(
            '/api/ask/',
            data={'question': ''},
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 400)

    def test_400_contains_error_field(self):
        response = self.client.post(
            '/api/ask/',
            data={'question': ''},
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 400)
        data = response.json()
        # AskView now uses AskRequestSerializer — DRF returns field-level errors
        self.assertIn('question', data)  # serializer validation error for 'question' field

    @patch('apps.classroom.views.ask_view.generate_answer')
    def test_valid_question_returns_200(self, mock_generate):
        mock_generate.return_value = {
            'chunks': [{'speak': 'Gravity pulls you down.', 'diagram': {'action': 'none'}}],
            'topic': 'gravity',
            'diagram_type': 'gravity',
            'language': 'en',
            'tokens_used': 10,
            'model_info': {},
        }
        response = self.client.post(
            '/api/ask/',
            data={'question': 'What is gravity?', 'session_id': 'test-session'},
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('chunks', data)
        self.assertIn('topic', data)

    @patch('apps.classroom.views.ask_view.generate_answer')
    def test_session_id_is_forwarded_to_generate_answer(self, mock_generate):
        mock_generate.return_value = {
            'chunks': [], 'topic': 'test', 'diagram_type': 'default',
            'language': 'en', 'tokens_used': 0, 'model_info': {},
        }
        self.client.post(
            '/api/ask/',
            data={'question': 'test?', 'session_id': 'my-session-123'},
            content_type='application/json',
        )
        call_kwargs = mock_generate.call_args
        actual_session = call_kwargs.kwargs.get('session_id') if call_kwargs.kwargs else None
        if not actual_session and call_kwargs.args:
            actual_session = call_kwargs.args[1] if len(call_kwargs.args) > 1 else call_kwargs.args[0]
        self.assertEqual(actual_session, 'my-session-123')


class ClearSessionViewTests(TestCase):
    """POST /api/clear/"""

    @patch('apps.classroom.views.session_view.clear_session')
    def test_clear_session_returns_200(self, mock_clear):
        response = self.client.post(
            '/api/clear/',
            data={'session_id': 'test-session'},
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['status'], 'cleared')
        self.assertEqual(data['session_id'], 'test-session')

    @patch('apps.classroom.views.session_view.clear_session')
    def test_clear_session_calls_clear_with_correct_id(self, mock_clear):
        self.client.post(
            '/api/clear/',
            data={'session_id': 'abc-123'},
            content_type='application/json',
        )
        mock_clear.assert_called_once_with('abc-123')
