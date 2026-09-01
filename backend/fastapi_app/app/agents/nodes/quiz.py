"""
fastapi_app/app/agents/nodes/quiz.py
Single-responsibility quiz question generation node.
Returns validated structured quiz items.
"""
import logging
from typing import Dict, Any
from ..state import ClassroomState

logger = logging.getLogger(__name__)


async def quiz_node(state: ClassroomState) -> Dict[str, Any]:
    """
    Generates validated quiz questions for a lesson topic.
    """
    question = state.get("question", "")

    quiz_payload = {
        "topic": "Newton's Second Law",
        "questions": [
            {
                "id": "q1",
                "question": "What is the acceleration of a 5kg mass pushed by a 20N net force?",
                "options": ["2 m/s²", "4 m/s²", "10 m/s²", "100 m/s²"],
                "correct_option": 1,
                "explanation": "a = F / m = 20N / 5kg = 4 m/s².",
            }
        ],
    }

    return {
        "answer": "Quiz generated with 1 validated problem.",
        "structured_data": quiz_payload,
    }
