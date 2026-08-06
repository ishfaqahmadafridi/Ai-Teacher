"""
physics_teacher/services/streaming_service.py

Encapsulates all Gemini LLM initialisation, JSON parsing, and the SSE
streaming generator. Views.py remains a thin HTTP routing layer.
"""

import os
import re
import json
import logging

from physics_teacher.prompts import PHYSICS_TEACHER_SYSTEM_PROMPT, RAG_CONTEXT_TEMPLATE

logger = logging.getLogger(__name__)

# ── LLM Singleton ─────────────────────────────────────────────────────────────

_llm = None


def get_llm():
    """
    Lazily initialise the Gemini 2.5 Flash LLM with streaming support.
    Returns the same instance on every subsequent call (singleton pattern).
    """
    from langchain_google_genai import ChatGoogleGenerativeAI
    global _llm

    if _llm is not None:
        return _llm

    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        raise RuntimeError(
            'GEMINI_API_KEY is not set. Add it to backend/.env'
        )

    _llm = ChatGoogleGenerativeAI(
        model='gemini-2.5-flash',
        google_api_key=api_key,
        temperature=0.75,
        streaming=True,
    )
    logger.info('[StreamingService] Gemini LLM initialised with streaming=True.')
    return _llm


# ── JSON Helpers ──────────────────────────────────────────────────────────────

def strip_markdown_fences(raw_text: str) -> str:
    """Remove ```json ... ``` fences that Gemini sometimes wraps around JSON."""
    cleaned = re.sub(r'```(?:json)?\s*', '', raw_text)
    return cleaned.replace('```', '').strip()


def extract_json_object(text: str) -> dict:
    """
    Parse a JSON object from Gemini's raw response text.

    Strategy:
      1. Direct json.loads — fast path for well-formed responses.
      2. Substring extraction from first '{' to last '}' — handles leading/trailing noise.

    Raises:
        ValueError: if no valid JSON object can be extracted.
    """
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    start = text.find('{')
    end = text.rfind('}')

    if start == -1 or end == -1:
        raise ValueError(f'No JSON object found in Gemini response: {text[:300]}')

    try:
        return json.loads(text[start: end + 1])
    except json.JSONDecodeError as parse_error:
        raise ValueError(
            f'Could not parse JSON from Gemini response. '
            f'Error: {parse_error}. '
            f'Raw snippet: {text[start: end + 1][:300]}'
        ) from parse_error


def build_fallback_response(student_question: str) -> dict:
    """
    Return a safe two-phase fallback when Gemini fails.
    The frontend always receives a valid TeachingResponse shape.
    """
    return {
        'topic': 'error',
        'language': 'en',
        'diagram_type': 'default',
        'phases': [
            {
                'phase': 0,
                'name': 'background',
                'diagram_action': 'none',
                'speak': (
                    'I am having a small technical difficulty right now. '
                    'Please ask your question again and I will explain it properly.'
                ),
                'key_point': None,
                'joke': None,
                'teacher_position': 'left',
            },
            {
                'phase': 1,
                'name': 'student_question',
                'diagram_action': 'none',
                'speak': f'Your question was: {student_question}. Please try again.',
                'key_point': None,
                'wait_for_answer': True,
                'teacher_position': 'center',
            },
        ],
    }


def _apply_teacher_position_defaults(phases: list) -> None:
    """
    Mutates the phases list in-place to ensure every phase has a teacher_position.
    Called after Gemini's response is parsed — guards against omissions.
    """
    last_index = len(phases) - 1
    for i, phase in enumerate(phases):
        if 'teacher_position' not in phase:
            if i == 0:
                phase['teacher_position'] = 'left'
            elif i == 1:
                phase['teacher_position'] = 'right'
            elif i == last_index:
                phase['teacher_position'] = 'center'
            else:
                phase['teacher_position'] = 'left' if i % 2 == 0 else 'right'


# ── SSE Stream Generator ──────────────────────────────────────────────────────

def stream_teaching_phases(student_question: str, language: str):
    """
    Generator that drives the SSE response lifecycle:

      1. Calls RAG (fast, local, <1 s)
      2. Builds the system prompt with optional textbook context
      3. Streams Gemini's response token-by-token (accumulates full text)
      4. Parses and validates the accumulated JSON
      5. Yields SSE-formatted event strings

    Yields:
        str: SSE data lines, e.g. 'data: {...}\\n\\n'
    """
    from langchain_core.messages import SystemMessage, HumanMessage
    from teacher.rag import search as rag_search

    try:
        # Step 1: RAG retrieval
        logger.info(f"[StreamingService] RAG search for: '{student_question[:60]}'")
        rag_context = rag_search(student_question, top_k=4)

        # Step 2: Build system prompt
        if rag_context:
            system_content = PHYSICS_TEACHER_SYSTEM_PROMPT + RAG_CONTEXT_TEMPLATE.format(
                rag_context=rag_context
            )
        else:
            system_content = PHYSICS_TEACHER_SYSTEM_PROMPT
            logger.warning(
                f"[StreamingService] No RAG context for: '{student_question[:60]}'"
            )

        # Step 3: Language instruction
        language_instruction = (
            f"The student wrote their question in language code: '{language}'. "
            f"Teach in that language. Set the 'language' field in your JSON to '{language}'."
        )

        # Step 4: Stream Gemini response
        llm = get_llm()
        messages = [
            SystemMessage(content=system_content),
            HumanMessage(content=f'{language_instruction}\n\nStudent question: {student_question}'),
        ]

        logger.info(f"[StreamingService] Starting Gemini stream for: '{student_question[:80]}'")

        # Heartbeat — sent immediately so the browser connection does not time out
        yield f"data: {json.dumps({'status': 'thinking'})}\n\n"

        full_text = ''
        for chunk in llm.stream(messages):
            token = chunk.content
            if token:
                full_text += token

        logger.info(f'[StreamingService] Stream complete. Length: {len(full_text)} chars')

        # Step 5: Parse and validate
        cleaned = strip_markdown_fences(full_text)
        parsed = extract_json_object(cleaned)

        parsed.setdefault('topic', student_question[:30])
        parsed.setdefault('language', language)
        parsed.setdefault('diagram_type', 'default')
        parsed.setdefault('phases', [])

        _apply_teacher_position_defaults(parsed['phases'])

        if not isinstance(parsed['phases'], list):
            raise ValueError("'phases' must be a list.")

        logger.info(
            f"[StreamingService] Parsed {len(parsed['phases'])} phases "
            f"for topic: '{parsed.get('topic')}'"
        )

        # Step 6: Emit result
        yield f"data: {json.dumps({'result': parsed})}\n\n"
        yield 'data: [DONE]\n\n'

    except RuntimeError as config_error:
        logger.error(f'[StreamingService] Configuration error: {config_error}')
        yield f"data: {json.dumps({'error': str(config_error), 'code': 503})}\n\n"
        yield 'data: [DONE]\n\n'

    except Exception as exc:
        logger.exception(f'[StreamingService] Stream error: {exc}')
        fallback = build_fallback_response(student_question)
        yield f"data: {json.dumps({'result': fallback})}\n\n"
        yield 'data: [DONE]\n\n'
