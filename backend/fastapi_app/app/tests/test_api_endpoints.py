"""
fastapi_app/app/tests/test_api_endpoints.py
End-to-end HTTP API integration tests for FastAPI endpoints.
"""
import unittest
from fastapi.testclient import TestClient
from app.main import app


class TestAPIEndpoints(unittest.TestCase):
    """End-to-end test suite for FastAPI HTTP endpoints."""

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

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
        """POST /api/v1/agents/grade-assignment returns score and feedback."""
        payload = {
            "student_answer": "F = m * a",
            "question_prompt": "State Newton's second law",
            "max_score": 100,
        }
        response = self.client.post("/api/v1/agents/grade-assignment", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("score", data)
        self.assertIn("feedback", data)
        self.assertEqual(data["max_score"], 100)

    def test_agent_generate_timetable_endpoint(self):
        """POST /api/v1/agents/generate-timetable returns timetable schedule."""
        payload = {
            "registered_class": "Physics Mechanics 101",
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

    def test_stream_ask_endpoint(self):
        """POST /api/v1/stream/ask returns SSE event stream or valid response."""
        payload = {
            "question": "What is mass?",
            "session_id": "e2e_test_session",
        }
        response = self.client.post("/api/v1/stream/ask", json=payload)
        self.assertEqual(response.status_code, 200)


if __name__ == "__main__":
    unittest.main()

