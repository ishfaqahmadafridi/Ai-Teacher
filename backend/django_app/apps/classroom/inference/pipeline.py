"""Orchestrate retrieval, validated LLM responses, and persistent history."""
import json
import logging

from apps.classroom.constants import (
    DEFAULT_SESSION_ID, DEFAULT_TEMPERATURE, GEMINI_MODEL, MODEL_ARCHITECTURE,
    RAG_SOURCE, RAG_TOP_K,
)
from apps.classroom.services import get_llm, extract_json, fallback_chunks, get_session
from apps.classroom.services.session_service import clear_session, append_session
from apps.classroom.serializers import GeneratedAnswerSerializer
from apps.classroom.prompts import SYSTEM_PROMPT, RAG_CONTEXT_SUFFIX

logger = logging.getLogger(__name__)


def generate_answer(
    question: str,
    session_id: str = DEFAULT_SESSION_ID,
    temperature: float = DEFAULT_TEMPERATURE,
    research: bool = False,
    **kwargs,
) -> dict:
    """Generate validated teaching chunks; failed answers do not enter history."""
    from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
    from apps.classroom.rag import search as rag_search

    metadata = {
        "architecture": MODEL_ARCHITECTURE, "model_type": GEMINI_MODEL,
        "source": RAG_SOURCE, "session_id": session_id, "rag_used": False,
    }
    try:
        llm = get_llm(temperature)
        if llm is None:
            return {**fallback_chunks(question), "tokens_used": 0, "model_info": metadata}
        rag_context = rag_search(question, top_k=RAG_TOP_K)
        metadata["rag_used"] = bool(rag_context)
        system_prompt = SYSTEM_PROMPT
        if rag_context:
            system_prompt += RAG_CONTEXT_SUFFIX.format(rag_context=rag_context)
        if research:
            from apps.classroom.services.research_context import build_research_context
            context, research_metadata = build_research_context(question)
            metadata.update(research_metadata)
            system_prompt += context
        history = get_session(session_id)
        messages = [SystemMessage(content=system_prompt)]
        for entry in history:
            message_type = HumanMessage if entry["role"] == "user" else AIMessage
            messages.append(message_type(content=entry["content"]))
        messages.append(HumanMessage(content=question))
        response = llm.invoke(messages)
        # LangChain normalizes provider text blocks through AIMessage.text.
        raw_answer = response.text
        serializer = GeneratedAnswerSerializer(data=extract_json(raw_answer))
        serializer.is_valid(raise_exception=True)
        parsed = dict(serializer.validated_data)
        append_session(session_id, [
            {"role": "user", "content": question},
            {"role": "assistant", "content": json.dumps(parsed)},
        ])
        usage = response.usage_metadata or {}
        return {
            **parsed, "tokens_used": usage.get("total_tokens", 0),
            "model_info": metadata,
        }
    except Exception:
        logger.exception("Classroom answer generation failed")
        return {**fallback_chunks(question), "tokens_used": 0, "model_info": metadata}
