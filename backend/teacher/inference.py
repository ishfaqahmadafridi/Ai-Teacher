"""
teacher/inference.py

Physics teacher inference orchestrator.

Takes a student question, retrieves relevant textbook passages from RAG,
and sends them to Gemini 2.5 Flash with a strict system prompt that forces
a structured JSON response (list of "chunks" with speak + diagram actions).

All low-level concerns are delegated to the services layer:
    teacher/services/llm_service.py     — LLM init, JSON parsing, fallback
    teacher/services/session_service.py — conversation history store
"""

import logging

from teacher.services import get_llm, extract_json, fallback_chunks, get_session, save_session

logger = logging.getLogger(__name__)

# ── System Prompt ──────────────────────────────────────────────────────────────
# Instructs Gemini to behave like a real professor and return structured JSON.

SYSTEM_PROMPT = """You are Prof. Gemini — a passionate, engaging University Physics Professor.
You are NOT a chatbot. You are a TEACHER who explains physics the way a real professor does.

## YOUR ONLY VALID OUTPUT FORMAT

You MUST return a single JSON object. Nothing before it, nothing after it.
Do not wrap it in markdown code fences. Raw JSON only.

{
  "chunks": [
    {
      "speak": "spoken sentence here",
      "diagram": {
        "action": "none | highlight | rotate | zoom | show_formula",
        "target": "optional object name e.g. 'earth', 'electron', 'nucleus'",
        "speed": "slow | fast (only for rotate)",
        "formula": "LaTeX string (only for show_formula)"
      }
    }
  ],
  "topic": "one word topic e.g. gravity",
  "diagram_type": "gravity | electric_field | projectile | wave | circuit | atom | default",
  "language": "en | ur | ar | fr | hi"
}

## TEACHING RULES — FOLLOW EVERY SINGLE ONE

RULE 1 — Hook first, NEVER a definition first.
RULE 2 — Real analogy BEFORE any concept.
RULE 3 — Always explain the WHY (use "BECAUSE").
RULE 4 — Short spoken sentences. Conversational style.
RULE 5 — Add one light joke or fun moment.
RULE 6 — Formula comes LAST, after the student already understands the idea.
RULE 7 — Point to the diagram while explaining.
RULE 8 — End with ONE comprehension question.
RULE 9 — Detect the student's language automatically.
RULE 10 — MAX 3-4 short sentences per chunk.

## DIAGRAM TYPES
gravity | electric_field | projectile | wave | circuit | atom | default
"""

RAG_CONTEXT_SUFFIX = """

## RELEVANT TEXTBOOK CONTEXT (from College Physics 2e)
Use this context to make your explanation accurate. Do NOT quote it verbatim.
Turn it into natural spoken teaching:

{rag_context}
"""


def generate_answer(
    question: str,
    session_id: str = 'default',
    temperature: float = 0.7,
    **kwargs,  # accept legacy params without error
) -> dict:
    """
    Generate a professor-style structured JSON response for a student's question.

    Steps:
      1. Retrieve relevant RAG passages from the physics textbook.
      2. Build conversation history with system prompt + RAG context.
      3. Send to Gemini 2.5 Flash.
      4. Parse the JSON response into a chunks array.

    Args:
        question:    The student's message.
        session_id:  Unique session ID for conversation memory.
        temperature: Sampling temperature.

    Returns:
        dict with keys: chunks, topic, diagram_type, language, tokens_used, model_info
    """
    from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
    from teacher.rag import search as rag_search

    llm = get_llm(temperature)

    # ── RAG context ────────────────────────────────────────────────────────────
    rag_context = rag_search(question, top_k=3)
    system_with_context = SYSTEM_PROMPT
    if rag_context:
        system_with_context += RAG_CONTEXT_SUFFIX.format(rag_context=rag_context)

    # ── Build messages from session history ────────────────────────────────────
    history = get_session(session_id)
    messages = [SystemMessage(content=system_with_context)]
    for entry in history:
        if entry['role'] == 'user':
            messages.append(HumanMessage(content=entry['content']))
        else:
            messages.append(AIMessage(content=entry['content']))
    messages.append(HumanMessage(content=question))

    # ── Call Gemini ────────────────────────────────────────────────────────────
    try:
        response = llm.invoke(messages)
        raw_answer = response.content

        try:
            parsed = extract_json(raw_answer)
        except ValueError as parse_err:
            logger.error(f'[Inference] JSON parse error: {parse_err}')
            parsed = fallback_chunks(question)

        parsed.setdefault('chunks', [])
        parsed.setdefault('topic', 'physics')
        parsed.setdefault('diagram_type', 'default')
        parsed.setdefault('language', 'en')

        # Persist updated session history
        history.append({'role': 'user', 'content': question})
        history.append({'role': 'assistant', 'content': raw_answer})
        save_session(session_id, history)

        return {
            'chunks': parsed['chunks'],
            'topic': parsed['topic'],
            'diagram_type': parsed['diagram_type'],
            'language': parsed['language'],
            'tokens_used': len(raw_answer.split()),
            'model_info': {
                'architecture': 'LangChain-Gemini-RAG',
                'model_type': 'gemini-2.5-flash',
                'source': 'college-physics-2e',
                'session_id': session_id,
                'rag_used': bool(rag_context),
            },
        }

    except Exception as exc:
        logger.error(f'[Inference] Gemini API error: {exc}')
        fb = fallback_chunks(question)
        return {**fb, 'tokens_used': 0, 'model_info': {'error': str(exc)}}


def clear_session(session_id: str) -> None:
    """Remove conversation history for the given session ID."""
    from teacher.services import clear_session as _clear
    _clear(session_id)
