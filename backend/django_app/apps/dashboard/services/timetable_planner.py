import json
from django.conf import settings
from pydantic import BaseModel, Field, create_model
from typing import Literal
from apps.classroom.services.llm_service import get_llm
from .timetable_scheduler import capacity
from ..constants.timetable_prompts import TIMETABLE_SYSTEM_PROMPT

class LearningSession(BaseModel):
    course_id: str
    title: str = Field(min_length=1, max_length=255)

def plan_sessions(inputs):
    llm = get_llm(model=settings.TIMETABLE_MODEL, max_retries=0)
    if llm is None:
        raise ValueError("AI planning is unavailable. Please try again later.")
    # Reuse the existing provider integration; keep student identity out of the prompt.
    course_ids = tuple(str(course["id"]) for course in inputs["courses"])
    target = capacity(inputs["preferences"])
    if target < len(course_ids):
        raise ValueError("Your availability cannot fit at least one session for every course.")
    base, extra = divmod(target, len(course_ids))
    targets = {course_id: base + (index < extra) for index, course_id in enumerate(course_ids)}
    session_schema = create_model("RegisteredLearningSession", __base__=LearningSession, course_id=(Literal[course_ids], ...))
    plan_schema = create_model("RegisteredLearningPlan", sessions=(list[session_schema], Field(min_length=target, max_length=target)))
    prompt_inputs = {**inputs, "courses": [{**course, "id": str(course["id"])} for course in inputs["courses"]], "target_sessions": target, "session_targets": targets}
    response = llm.with_structured_output(plan_schema).invoke([
        ("system", TIMETABLE_SYSTEM_PROMPT),
        ("human", json.dumps(prompt_inputs)),
    ])
    plan = plan_schema.model_validate(response)
    expected = {str(course["id"]) for course in inputs["courses"]}
    actual = {session.course_id for session in plan.sessions}
    if actual != expected:
        raise ValueError("The AI plan did not cover your registered courses correctly. Please retry.")
    for course_id, count in targets.items():
        if sum(session.course_id == course_id for session in plan.sessions) != count:
            raise ValueError("The AI plan did not match the requested course workload.")
    return [session.model_dump() for session in plan.sessions]
