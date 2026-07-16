"""
physics_teacher/tests/test_views.py

Tests for the ExplainView and HealthView HTTP endpoints.
Uses Django's test client — no real LLM or RAG calls are made.
"""

from unittest.mock import patch, MagicMock
from django.test import TestCase
from django.urls import reverse


class HealthViewTests(TestCase):
    """GET /api/physics-teacher/health/"""

    def test_health_returns_200(self):
        response = self.client.get('/api/physics-teacher/health/')
        self.assertEqual(response.status_code, 200)

    def test_health_response_shape(self):
        response = self.client.get('/api/physics-teacher/health/')
        data = response.json()
        self.assertIn('status', data)
        self.assertIn('app', data)
        self.assertIn('streaming', data)
        self.assertEqual(data['app'], 'physics_teacher')
        self.assertTrue(data['streaming'])


class ExplainViewTests(TestCase):
    """POST /api/physics-teacher/explain/"""

    def test_missing_question_returns_400(self):
        response = self.client.post(
            '/api/physics-teacher/explain/',
            data={},
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 400)

    def test_empty_question_returns_400(self):
        response = self.client.post(
            '/api/physics-teacher/explain/',
            data={'question': '   '},
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 400)

    def test_400_response_contains_error_and_hint(self):
        response = self.client.post(
            '/api/physics-teacher/explain/',
            data={'question': ''},
            content_type='application/json',
        )
        data = response.json()
        self.assertIn('error', data)
        self.assertIn('hint', data)

    @patch('physics_teacher.views.stream_teaching_phases')
    def test_valid_question_returns_streaming_response(self, mock_stream):
        """A valid question should return a StreamingHttpResponse with SSE content type."""
        mock_stream.return_value = iter([
            'data: {"status": "thinking"}\n\n',
            'data: {"result": {"topic": "gravity", "phases": []}}\n\n',
            'data: [DONE]\n\n',
        ])

        response = self.client.post(
            '/api/physics-teacher/explain/',
            data={'question': 'What is gravity?'},
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn('text/event-stream', response.get('Content-Type', ''))
        mock_stream.assert_called_once_with('What is gravity?', 'en')

    @patch('physics_teacher.views.stream_teaching_phases')
    def test_language_parameter_is_forwarded(self, mock_stream):
        mock_stream.return_value = iter(['data: [DONE]\n\n'])
        self.client.post(
            '/api/physics-teacher/explain/',
            data={'question': 'gravity kya hai?', 'language': 'ur'},
            content_type='application/json',
        )
        mock_stream.assert_called_once_with('gravity kya hai?', 'ur')
