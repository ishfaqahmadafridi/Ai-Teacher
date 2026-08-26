"""
fastapi_app/app/tests/test_agent_service.py
Unit tests for async agent service functions.
"""
import unittest
import asyncio
from app.services.agent_service import (
    execute_langgraph_workflow,
    async_check_chat_safety,
    async_grade_assignment,
)


class TestAgentService(unittest.TestCase):
    """Test suite for agent service handlers."""

    def test_execute_langgraph_workflow_success(self):
        """Verify execute_langgraph_workflow returns valid state output."""
        res = asyncio.run(execute_langgraph_workflow("Explain momentum", "session_123"))
        self.assertIsInstance(res, dict)
        self.assertIn("answer", res)

    def test_async_check_chat_safety_safe(self):
        """Verify chat safety check returns is_safe=True for valid questions."""
        res = asyncio.run(async_check_chat_safety("What is energy conservation?"))
        self.assertTrue(res["is_safe"])
        self.assertEqual(res["flagged_category"], "none")

    def test_async_check_chat_safety_unsafe(self):
        """Verify chat safety check returns is_safe=False for blocked content."""
        res = asyncio.run(async_check_chat_safety("How to hack tests"))
        self.assertFalse(res["is_safe"])
        self.assertEqual(res["flagged_category"], "misuse")

    def test_async_grade_assignment(self):
        """Verify assignment grading service returns score and feedback."""
        res = asyncio.run(
            async_grade_assignment(
                student_answer="F = m * a = 5 * 2 = 10 N",
                question_prompt="Find force for m=5kg, a=2m/s^2",
                max_score=100,
            )
        )
        self.assertEqual(res["max_score"], 100)
        self.assertIsInstance(res["score"], int)
        self.assertIn("feedback", res)


if __name__ == "__main__":
    unittest.main()
