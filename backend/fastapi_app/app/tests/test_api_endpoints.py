"""
fastapi_app/app/tests/test_api_endpoints.py
End-to-end HTTP API integration tests for FastAPI endpoints.
"""
import unittest
from unittest.mock import AsyncMock, Mock, patch
from langchain_core.messages import AIMessage
from app.core.errors import InferenceUnavailable
import secrets
import time
import jwt
from fastapi.testclient import TestClient
from app.main import app


class TestAPIEndpoints(unittest.TestCase):
    """End-to-end test suite for FastAPI HTTP endpoints."""

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def setUp(self):
        model = Mock()
        model.ainvoke = AsyncMock(return_value=AIMessage(content='Controlled test explanation.'))
        for target in ('app.agents.nodes.tutor.get_langchain_llm', 'app.agents.nodes.solver.get_langchain_llm'):
            provider_patch = patch(target, return_value=model)
            provider_patch.start()
            self.addCleanup(provider_patch.stop)
        retrieval_patch = patch('app.services.stream_context.get_stream_context', new_callable=AsyncMock, return_value='')
        retrieval_patch.start()
        self.addCleanup(retrieval_patch.stop)
        key = secrets.token_urlsafe(32)
        self.signing_key = patch('app.core.security.settings.SECRET_KEY', key)
        self.signing_key.start()
        self.addCleanup(self.signing_key.stop)
        token = jwt.encode({'user_id': 42, 'token_type': 'access', 'exp': int(time.time()) + 60}, key, algorithm='HS256')
        self.client.headers['Authorization'] = f'Bearer {token}'
        self.addCleanup(lambda: self.client.headers.pop('Authorization', None))

    def test_inference_requires_access_token(self):
        response = self.client.post('/api/v1/stream/ask', json={'question': 'What is mass?'}, headers={'Authorization': ''})
        self.assertEqual(response.status_code, 401)

    def test_invalid_token_cannot_execute_agent(self):
        response = self.client.post('/api/v1/agents/execute', json={'question': 'Explain mass'}, headers={'Authorization': 'Bearer invalid'})
        self.assertEqual(response.status_code, 401)

    def test_health_check_endpoint(self):
        """GET /api/v1/health/ should return HTTP 200 with status ok."""
        response = self.client.get("/api/v1/health/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "ok")

    def test_agent_safety_check_safe(self):
        """POST /api/v1/agents/safety-check with academic input returns HTTP 200 safe."""
        payload = {"message": "How does gravity work?"}
        response = self.client.post("/api/v1/agents/safety-check", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["is_safe"])
        self.assertEqual(data["flagged_category"], "none")

    def test_agent_safety_check_unsafe(self):
        """POST /api/v1/agents/safety-check with inappropriate input returns is_safe=False."""
        payload = {"message": "attempting to cheat on exam"}
        response = self.client.post("/api/v1/agents/safety-check", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertFalse(data["is_safe"])

    def test_agent_grade_assignment_endpoint(self):
        """Legacy assignment grading returns 503 instead of a fixed score."""
        payload = {
            "student_answer": "F = m * a",
            "question_prompt": "State Newton's second law",
            "max_score": 100,
        }
        response = self.client.post("/api/v1/agents/grade-assignment", json=payload)
        self.assertEqual(response.status_code, 503)
        self.assertNotIn('score', response.json())

    def test_agent_generate_timetable_endpoint(self):
        """POST /api/v1/agents/generate-timetable returns timetable schedule."""
        payload = {
            "registered_class": "Physics Mechanics 101",
            "registered_courses": ["Physics Mechanics 101"],
            "preferred_time": "morning",
            "max_classes_per_day": 2,
        }
        response = self.client.post("/api/v1/agents/generate-timetable", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["class_name"], "Physics Mechanics 101")
        self.assertIn("schedule", data)
        self.assertIn("optimization_summary", data)

    def test_agent_execute_endpoint(self):
        """POST /api/v1/agents/execute returns complete LangGraph workflow response with telemetry."""
        payload = {
            "question": "Explain kinetic energy",
            "session_id": "test_exec_session",
            "course_id": "Physics Mechanics 101",
        }
        response = self.client.post("/api/v1/agents/execute", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("answer", data)
        self.assertIn("intent", data)
        self.assertEqual(data["safety_status"], "safe")
        self.assertIn("telemetry", data)
        self.assertIn("total_duration_ms", data["telemetry"])

    @patch('app.services.llm_service._build_llm', return_value=None)
    def test_stream_ask_endpoint(self, provider):
        """POST /api/v1/stream/ask returns SSE event stream or valid response."""
        payload = {
            "question": "What is mass?",
            "session_id": "e2e_test_session",
        }
        response = self.client.post("/api/v1/stream/ask", json=payload)
        self.assertEqual(response.status_code, 200)


if __name__ == "__main__":
    unittest.main()

