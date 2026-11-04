"""
fastapi_app/app/tests/test_agent_service.py
Unit tests for async agent service functions.
"""
import unittest
from unittest.mock import AsyncMock, Mock, patch
from langchain_core.messages import AIMessage
from app.core.errors import InferenceUnavailable
import asyncio
from app.services.agent_service import (
    execute_langgraph_workflow,
    async_check_chat_safety,
    async_grade_assignment,
)


class TestAgentService(unittest.TestCase):
    """Test suite for agent service handlers."""

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
        """Verify legacy assignment grading explicitly reports unavailability."""
        with self.assertRaises(InferenceUnavailable):
            asyncio.run(async_grade_assignment(
                student_answer='F = m * a = 5 * 2 = 10 N',
                question_prompt='Find force for m=5kg, a=2m/s^2', max_score=100,
            ))



if __name__ == "__main__":
    unittest.main()
