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
)
from app.services.agent_service import async_check_chat_safety, async_grade_assignment

router = APIRouter()


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
