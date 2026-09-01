"""
fastapi_app/app/api/v1/endpoints/agents.py
FastAPI async endpoints for real-time safety guardrails and assignment evaluation.
"""
from fastapi import APIRouter, HTTPException, status
from app.schemas.agent_schemas import (
    ChatSafetyRequest,
    ChatSafetyResponse,
    GradeAssignmentRequest,
    GradeAssignmentResponse,
    TimetableRequest,
    TimetableResponse,
    AgentWorkflowRequest,
    AgentWorkflowResponse,
)
from app.services.agent_service import (
    async_check_chat_safety,
    async_grade_assignment,
    async_generate_timetable,
    execute_langgraph_workflow,
)

router = APIRouter()


@router.post(
    "/execute",
    response_model=AgentWorkflowResponse,
    status_code=status.HTTP_200_OK,
    summary="Execute full LangGraph agent workflow with performance telemetry",
)
async def execute_agent(payload: AgentWorkflowRequest):
    """Executes the optimal state node path through the compiled classroom graph."""
    res = await execute_langgraph_workflow(
        question=payload.question,
        session_id=payload.session_id,
        course_id=payload.course_id or "Physics Mechanics 101",
        metadata=payload.metadata,
    )
    return AgentWorkflowResponse(
        answer=res.get("answer", ""),
        intent=res.get("intent", "tutor"),
        safety_status=res.get("safety_status", "safe"),
        structured_data=res.get("structured_data"),
        citations=res.get("citations", []),
        telemetry=res.get("telemetry"),
    )


@router.post(
    "/safety-check",
    response_model=ChatSafetyResponse,
    status_code=status.HTTP_200_OK,
    summary="Real-time chat safety guardrail check",
)
async def check_safety(payload: ChatSafetyRequest):
    """Evaluates student chat message for misuse or inappropriate content asynchronously."""
    result = await async_check_chat_safety(payload.message)
    return ChatSafetyResponse(**result)


@router.post(
    "/grade-assignment",
    response_model=GradeAssignmentResponse,
    status_code=status.HTTP_200_OK,
    summary="Async AI assignment grading evaluation",
)
async def grade_assignment(payload: GradeAssignmentRequest):
    """Evaluates student assignment submission with instant feedback."""
    result = await async_grade_assignment(
        student_answer=payload.student_answer,
        question_prompt=payload.question_prompt,
        max_score=payload.max_score,
    )
    return GradeAssignmentResponse(**result)


@router.post(
    "/generate-timetable",
    response_model=TimetableResponse,
    status_code=status.HTTP_200_OK,
    summary="Personalized constraint-optimized timetable generation",
)
async def generate_timetable(payload: TimetableRequest):
    """Generates balanced weekly schedule respecting student preferences and course constraints."""
    result = await async_generate_timetable(
        registered_class=payload.registered_class,
        registered_courses=payload.registered_courses,
        preferred_time=payload.preferred_time,
        max_classes_per_day=payload.max_classes_per_day,
        include_saturday=payload.include_saturday,
        available_hours=payload.available_hours,
    )
    return TimetableResponse(**result)


