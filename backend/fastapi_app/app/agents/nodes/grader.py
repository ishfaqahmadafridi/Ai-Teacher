"""Legacy grading has no validated rubric pipeline; never return a fabricated score."""
from app.core.errors import InferenceUnavailable
from ..state import ClassroomState


async def grader_node(state: ClassroomState) -> dict:
    raise InferenceUnavailable()
