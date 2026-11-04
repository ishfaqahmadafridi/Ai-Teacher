"""Orchestrate retrieval, validated LLM responses, and persistent history."""
import json
import logging

from apps.classroom.constants import (
    DEFAULT_SESSION_ID, DEFAULT_TEMPERATURE, GEMINI_MODEL, MODEL_ARCHITECTURE,
    RAG_SOURCE, RAG_TOP_K,
)
from apps.classroom.services import get_llm, fallback_chunks, get_session
from apps.classroom.services.session_service import append_session
from apps.classroom.services.prompt_budget import model_prompt_limits, PromptBudgetExceeded

logger = logging.getLogger(__name__)


def generate_answer(
    question: str,
    session_id: str = DEFAULT_SESSION_ID,
    temperature: float = DEFAULT_TEMPERATURE,
    research: bool = False,
    persist_history: bool = True,
    curriculum=None,
    student_context=None,
    require_curriculum_coverage=False,
    **kwargs,
) -> dict:
    """Generate validated teaching chunks; failed answers do not enter history."""
    from apps.classroom.rag import search as rag_search

    metadata = {
        "architecture": MODEL_ARCHITECTURE, "model_type": GEMINI_MODEL,
        "source": RAG_SOURCE, "session_id": session_id, "rag_used": False,
    }
    try:
        llm = get_llm(temperature)
        if llm is None:
            return {**fallback_chunks(question), "tokens_used": 0, "model_info": metadata}
        try:
            rag_context = rag_search(question, top_k=RAG_TOP_K)
        except Exception:
            logger.warning('Optional classroom textbook retrieval unavailable')
            rag_context = ''
            metadata['rag_unavailable'] = True
        metadata["rag_used"] = bool(rag_context)
        from apps.classroom.services.lesson_visuals import resolve_lesson_visuals, image_catalog_prompt
        supplemental_context = {}
        if student_context:
            supplemental_context['student'] = student_context
        if curriculum:
            supplemental_context['scheduled_lesson'] = {**curriculum, 'require_full_coverage': require_curriculum_coverage}
        if rag_context:
            supplemental_context['textbook'] = rag_context
        images = []
        if research:
            from apps.classroom.services.research_context import build_research_context
            _, research_metadata = build_research_context(question)
            metadata.update(research_metadata)
            images = research_metadata.get("images", [])
            supplemental_context['research'] = {'sources': research_metadata['sources'], 'status': research_metadata['research_status']}
        if images:
            supplemental_context['image_catalog'] = image_catalog_prompt(images)
        history = get_session(session_id)
        context_limit, output_tokens = model_prompt_limits(llm)
        from apps.classroom.services.teaching_quality import generate_reviewed_teaching
        parsed, response, teaching_tokens = generate_reviewed_teaching(
            llm, question, history, supplemental_context, context_limit, output_tokens, metadata,
            curriculum=curriculum, require_full_coverage=require_curriculum_coverage)
        provider_metadata = response.response_metadata or {}
        if provider_metadata.get('classroom_provider'):
            metadata['provider'] = provider_metadata['classroom_provider']
            metadata['model_type'] = provider_metadata['model_name']
        if curriculum and require_curriculum_coverage:
            from apps.classroom.services.curriculum_coverage import review_curriculum_coverage
            metadata['curriculum_coverage'], metadata['curriculum_review_tokens'] = review_curriculum_coverage(llm, parsed, curriculum, student_context)
            metadata['curriculum_verified'] = True
            metadata['scheduled_session_id'] = curriculum['session_id']
        metadata["visual_planning_tokens"] = 0
        parsed = resolve_lesson_visuals(parsed, images)
        metadata["visual_selection_tokens"] = parsed.pop("visual_selection_tokens", 0)
        parsed.setdefault("topic", question)
        metadata["image_status"] = "selected" if any(chunk["diagram"].get("target") for chunk in parsed["chunks"]) else "no_matching_image"
        if persist_history:
            append_session(session_id, [
                {"role": "user", "content": question},
                {"role": "assistant", "content": json.dumps(parsed)},
            ])
        usage = response.usage_metadata or {}
        metadata['prompt_budget']['provider_input_tokens'] = usage.get('input_tokens')
        metadata['prompt_budget']['provider_output_tokens'] = usage.get('output_tokens')
        return {
            **parsed, "tokens_used": teaching_tokens + metadata.get("curriculum_review_tokens", 0) + metadata["visual_selection_tokens"] + metadata["visual_planning_tokens"],
            "model_info": metadata,
        }
    except PromptBudgetExceeded:
        metadata['context_budget_exceeded'] = True
        logger.warning('Classroom context exceeded configured budget; provider generation/review stopped')
        return {**fallback_chunks(question), "tokens_used": metadata.get("teaching_quality", {}).get("tokens_used", 0), "model_info": metadata}
    except Exception:
        logger.exception("Classroom answer generation failed")
        return {**fallback_chunks(question), "tokens_used": metadata.get("teaching_quality", {}).get("tokens_used", 0), "model_info": metadata}
