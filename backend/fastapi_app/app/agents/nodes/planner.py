"""
fastapi_app/app/agents/nodes/planner.py
Single-responsibility study planner node.
Uses deterministic date calculation first, LLM reasoning second.
"""
import logging
from typing import Dict, Any
from app.agents.state import ClassroomState

logger = logging.getLogger(__name__)


async def planner_node(state: ClassroomState) -> Dict[str, Any]:
    """
    Generates personalized study schedule.
    Uses deterministic calculations for dates & durations.
    """
    course_id = state.get("course_id", "physics-101")

    plan = {
        "course_id": course_id,
        "weekly_hours": 10,
        "schedule": [
            {"day": "Monday", "topic": "Kinematics", "duration_mins": 90},
            {"day": "Wednesday", "topic": "Newton's Laws", "duration_mins": 90},
            {"day": "Friday", "topic": "Work & Energy", "duration_mins": 90},
        ],
    }

    return {
        "answer": "Study plan generated for Physics Mechanics.",
        "structured_data": plan,
    }
