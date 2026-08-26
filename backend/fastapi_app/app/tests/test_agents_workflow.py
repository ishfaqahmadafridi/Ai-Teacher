"""
fastapi_app/app/tests/test_agents_workflow.py
Unit tests for LangGraph state nodes, intent routing, and full graph execution.
"""
import unittest
import asyncio
from app.agents.state import ClassroomState
from app.agents.router import route_intent, select_next_node
from app.agents.graph import compiled_classroom_graph
from app.agents.nodes import (
    safety_node,
    tutor_node,
    retrieval_node,
    solver_node,
    critic_node,
    grader_node,
    quiz_node,
    planner_node,
)


class TestAgentsWorkflow(unittest.TestCase):
    """Test suite for single-responsibility state nodes and intent routing."""

    def test_safety_node_safe_question(self):
        """Verify safety node accepts normal academic questions."""
        state: ClassroomState = {"question": "What is Newton's second law?"}
        res = asyncio.run(safety_node(state))
        self.assertEqual(res["safety_status"], "safe")
        self.assertIsNone(res["warning_reason"])

    def test_safety_node_empty_question(self):
        """Verify safety node blocks empty questions."""
        state: ClassroomState = {"question": "   "}
        res = asyncio.run(safety_node(state))
        self.assertEqual(res["safety_status"], "blocked")
        self.assertIn("Empty question", res["warning_reason"])

    def test_safety_node_forbidden_term(self):
        """Verify safety node blocks forbidden non-academic terms."""
        state: ClassroomState = {"question": "How to hack the classroom system?"}
        res = asyncio.run(safety_node(state))
        self.assertEqual(res["safety_status"], "blocked")
        self.assertIn("non-academic", res["warning_reason"])

    def test_route_intent_classification(self):
        """Verify intent router classifies keywords accurately."""
        # Assignment intent
        res = asyncio.run(route_intent({"question": "Grade my homework submission"}))
        self.assertEqual(res["intent"], "assignment")

        # Quiz intent
        res = asyncio.run(route_intent({"question": "Give me a practice quiz"}))
        self.assertEqual(res["intent"], "quiz")

        # Planner intent
        res = asyncio.run(route_intent({"question": "Create a study timetable for me"}))
        self.assertEqual(res["intent"], "study_plan")

        # Math intent
        res = asyncio.run(route_intent({"question": "Solve 5 + 10 * 2"}))
        self.assertEqual(res["intent"], "math")

        # Tutor default intent
        res = asyncio.run(route_intent({"question": "Explain acceleration"}))
        self.assertEqual(res["intent"], "tutor")

    def test_select_next_node_blocked(self):
        """Verify intent router returns end if safety_status is blocked."""
        next_node = select_next_node({"safety_status": "blocked", "intent": "tutor"})
        self.assertEqual(next_node, "end")

    def test_critic_node_bounded_revisions(self):
        """Verify critic node halts when MAX_REVISIONS limit is exceeded."""
        state: ClassroomState = {"critic_iterations": 2, "answer": "F = m * a"}
        res = asyncio.run(critic_node(state))
        self.assertEqual(res["critic_iterations"], 3)

    def test_grader_node_output(self):
        """Verify grader node returns evaluation payload with score."""
        state: ClassroomState = {"question": "Solve F = 10N, m = 2kg"}
        res = asyncio.run(grader_node(state))
        self.assertIn("structured_data", res)
        self.assertEqual(res["structured_data"]["score"], 92)

    def test_compiled_graph_execution(self):
        """Verify compiled LangGraph executes end-to-end without error."""
        initial_state: ClassroomState = {
            "question": "What is mass?",
            "session_id": "test_session",
            "critic_iterations": 0,
        }
        final_state = asyncio.run(compiled_classroom_graph.ainvoke(initial_state))
        self.assertIsNotNone(final_state)
        self.assertIn("answer", final_state)


if __name__ == "__main__":
    unittest.main()
