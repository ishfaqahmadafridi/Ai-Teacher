"""Legacy quiz generation has no validated pipeline; never return a canned quiz."""
from app.core.errors import InferenceUnavailable
from ..state import ClassroomState


async def quiz_node(state: ClassroomState) -> dict:
    raise InferenceUnavailable()
