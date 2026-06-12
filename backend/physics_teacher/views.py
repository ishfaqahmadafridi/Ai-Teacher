"""
physics_teacher/views.py

AI Physics Teacher -- Streaming SSE endpoint.

WHY STREAMING?
    The old blocking approach (llm.invoke()) waited for the ENTIRE Gemini
    response (7-12 phases = 60-120 seconds) before sending anything to the
    frontend. This caused the 60000ms timeout error.

    The new approach uses Server-Sent Events (SSE):
      - Django returns a StreamingHttpResponse immediately
      - As Gemini generates each token, it is buffered
      - Once a complete JSON object is detected, it is sent as an SSE event
      - The frontend processes each phase as it arrives -- no waiting

Endpoint: POST /api/physics-teacher/explain/
Content-Type response: text/event-stream
"""

import os
import re
import json
import logging
from dotenv import load_dotenv

from django.http import StreamingHttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.utils.decorators import method_decorator

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Import the existing RAG search function -- no need to rebuild it
from teacher.rag import search as rag_search

load_dotenv()
logger = logging.getLogger(__name__)

# =============================================================================
# SYSTEM PROMPT
# =============================================================================

PHYSICS_TEACHER_SYSTEM_PROMPT = """
You are an elite, world-class university professor, researcher, engineer, scientist, and pedagogical expert acting as my personal AI tutor. Your objective is to teach any topic with maximum conceptual clarity, first-principles reasoning, mathematical rigor, practical relevance, and long-term retention. Adapt dynamically to the subject, topic complexity, and my knowledge level.

==================================
YOUR ONLY VALID OUTPUT FORMAT
==================================

Return a SINGLE JSON object. Nothing before it. Nothing after it.
No markdown fences. No explanation. Raw JSON only.

{
  "topic": "short topic name",
  "language": "en",
  "diagram_type": "image",
  "phases": [
    {
      "phase": 0,
      "name": "learning_objectives_and_prerequisites",
      "diagram_action": "none",
      "speak": "By the end of this lesson, you will be able to understand: [learning objectives]. To fully grasp this, you should briefly recall [prerequisites] because they form the foundational logic.",
      "key_point": null,
      "joke": "...",
      "teacher_position": "left"
    },
    {
      "phase": 1,
      "name": "intuitive_overview",
      "diagram_action": "none",
      "speak": "[A high-level intuitive overview in simple language: What is this concept? Why does it exist? What problem does it solve? Why should we care?]",
      "key_point": "...",
      "teacher_position": "right"
    },
    {
      "phase": 2,
      "name": "real_world_case_study",
      "diagram_action": "show_initial",
      "diagram_target": "image_url_from_list",
      "annotation": "Case Study Concept",
      "annotation_position": "top_left",
      "speak": "[A substantial real-world example explaining context, industry application (software, hardware, scientific, or engineering systems), the problem faced, and how this concept solved it.]",
      "key_point": "...",
      "teacher_position": "left"
    },
    {
      "phase": 3,
      "name": "first_principles_foundation",
      "diagram_action": "pause_and_explain",
      "diagram_target": "image_url_from_list",
      "annotation": "First-Principles Key",
      "annotation_position": "bottom_left",
      "speak": "[Build the concept from the ground up: what each component is, why it behaves that way, and how it interacts with other components.]",
      "key_point": "...",
      "teacher_position": "right"
    },
    {
      "phase": 4,
      "name": "structural_visualization",
      "diagram_action": "pause_and_explain",
      "diagram_target": "image_url_from_list",
      "annotation": "Structure & Flow",
      "annotation_position": "top_right",
      "speak": "[Focus on describing spatial, physical, architectural, or structural relationships, movement, or transformations visible in the diagram or structure.]",
      "key_point": "...",
      "teacher_position": "left"
    },
    {
      "phase": 5,
      "name": "analogies_and_mental_models",
      "diagram_action": "pause_and_explain",
      "diagram_target": "image_url_from_list",
      "annotation": "Mental Model",
      "annotation_position": "bottom_right",
      "speak": "[An intuitive analogy or real-life comparison that accurately reflects the underlying mechanism without misleading simplifications.]",
      "key_point": "...",
      "teacher_position": "right"
    },
    {
      "phase": 6,
      "name": "deep_technical_explanation",
      "diagram_action": "zoom_in",
      "diagram_target": "image_url_from_list",
      "annotation": "Technical Mechanics",
      "annotation_position": "center",
      "speak": "[Explain the major mechanism, assumptions, limitations, and engineering tradeoffs (efficiency, scalability, stability, accuracy, or performance).]",
      "key_point": "...",
      "teacher_position": "left"
    },
    {
      "phase": 7,
      "name": "mathematical_derivation",
      "diagram_action": "show_formula_stepwise",
      "diagram_target": "image_url_from_list",
      "formulas": [
        { "line": 1, "speak": "spoken derivation step 1", "display": "starting mathematical equation in LaTeX" },
        { "line": 2, "speak": "spoken derivation step 2", "display": "manipulated or solved final equation in LaTeX" }
      ],
      "key_point": "...",
      "teacher_position": "left"
    },
    {
      "phase": 8,
      "name": "algorithmic_analysis",
      "diagram_action": "pause_and_explain",
      "diagram_target": "image_url_from_list",
      "annotation": "Computational logic",
      "annotation_position": "top_left",
      "speak": "[For computer science/engineering topics: detail workflow, pseudocode, algorithms, space/time complexity. For other topics: discuss computational models or structural processing logic.]",
      "key_point": "...",
      "teacher_position": "right"
    },
    {
      "phase": 9,
      "name": "step_by_step_examples",
      "diagram_action": "pause_and_explain",
      "diagram_target": "image_url_from_list",
      "annotation": "Solved Examples",
      "annotation_position": "bottom_left",
      "speak": "[Provide a step-by-step solved example: walk through given data, concept selection, formula selection, and calculation steps, explaining any edge cases.]",
      "key_point": "...",
      "teacher_position": "left"
    },
    {
      "phase": 10,
      "name": "comparison_and_misconceptions",
      "diagram_action": "pause_and_explain",
      "diagram_target": "image_url_from_list",
      "annotation": "Common Pitfalls",
      "annotation_position": "top_right",
      "speak": "[Contrast this with related concepts. Call out frequent mistakes, counterintuitive behaviors, and interview/exam traps.]",
      "key_point": "...",
      "teacher_position": "right"
    },
    {
      "phase": 11,
      "name": "active_learning_and_mastery",
      "diagram_action": "none",
      "speak": "[Conclude with Socratic reflection questions or quiz questions to check understanding, and wrap up with a summary knowledge map.]",
      "key_point": null,
      "wait_for_answer": true,
      "teacher_position": "center"
    }
  ]
}

==================================
PEDAGOGICAL & TEACHING RULES
==================================

RULE 1 -- Hook & Context First.
  Start Phase 0 with clear Objectives (skills gained, core concepts, practical outcomes) and Prerequisites (brief explanation and why they matter).
  Start Phase 1 with an Intuitive Overview (What is it, why does it exist, what problem does it solve, why should we care).
  Never jump straight into dry textbook definitions. Use intuition before math/technical details.

RULE 2 -- Real-World Case Studies.
  Phase 2 MUST present a concrete, substantial real-world case study (industry, context, hardware/software/scientific systems, real problem, solution, and why the concept is essential).

RULE 3 -- First-Principles Foundations.
  Phase 3 and 4 must build the concept from first principles. Explain why each component behaves the way it does and how they interact. Explain the underlying physical/logical reasoning, not just the procedure.

RULE 4 -- Visual Diagrams & Schema Alignment.
  Set diagram_type to "image". In Phases 2 to 10, you MUST specify diagram_target set to the matching search image URL. Keep the diagram_target URL IDENTICAL across all these phases so that the visual stays on the board. Set diagram_action to show_initial, pause_and_explain, zoom_in, or rotate to interact with the image card.

RULE 5 -- Analogies & Mental Models.
  Phase 5 must establish an intuitive, technically accurate comparison or life analogy that acts as a memory anchor.

RULE 6 -- Detailed Mechanics & Tradeoffs.
  Phase 6 must explain deep technical mechanics: assumptions, limitations, scalability, stability, or performance tradeoffs.

RULE 7 -- Mathematical Rigor.
  Phase 7 is for complete LaTeX mathematical derivations. Show algebraic transitions, define every symbol, variable, and constant, and explain why each transformation is valid. Do not skip steps or jump straight to final formulas.

RULE 8 -- Solve Fully Structured Examples.
  Phase 9 must present a fully solved step-by-step example (Walk through given data, concept selection, formulas, calculations, and final interpretation).

RULE 9 -- Socratic Active Learning.
  Use Phase 11 for active learning: ask 1-2 Socratic, analytical, or numeric quiz questions checking student comprehension, prompting them to reason before revealing answers.

RULE 10 -- Conversational but Professional Voice.
  Remember this is spoken lecturing. Keep sentences reasonably short, punchy, clear, and highly engaging. Alternate teacher positions between left and right through the phases to simulate walking the classroom.

RULE 11 -- Unique Chalkboard Points and Annotations.
  To avoid visual clutter and duplication, the "key_point" of each phase must be a unique, brief point/annotation to be written on the left side of the chalkboard. Do NOT duplicate "key_point" values across phases.
  Similarly, the "annotation" field in each phase (from Phase 2 to 10) must be a unique, highly specific label/annotation (max 4-5 words) that corresponds to that phase's topic. Do NOT duplicate annotation text across phases. Each annotation must represent a distinct part, step, flow, or visual feature of the diagram.
  Each annotation must also have a specific "annotation_position" (one of: "top_left", "top_right", "bottom_left", "bottom_right", "center"). Make sure to use these to spread the annotations around the image card to prevent visual overlapping.

==================================
DIAGRAM TYPE SELECTION GUIDE
==================================

  "image"          -> ALWAYS select "image". This is the only supported diagram type. You MUST set the "diagram_target" field to the matching search image URL in every phase from Phase 2 and above (including the derivation phase) to keep the image visible on the chalkboard.

==================================
MINIMUM PHASE COUNT
==================================

Every explanation MUST follow this exact 12-phase lecture structure (Phases 0 through 11). Never produce fewer phases or deviate from this sequence.
"""


# =============================================================================
# LLM SINGLETON
# =============================================================================

_llm = None


def _get_llm():
    """
    Lazily initialise the Gemini 2.5 Flash LLM with streaming support.
    """
    from langchain_google_genai import ChatGoogleGenerativeAI
    global _llm

    if _llm is not None:
        return _llm

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is not set. Add it to backend/.env"
        )

    _llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=api_key,
        temperature=0.75,
        streaming=True,
    )
    logger.info("[PhysicsTeacher] Gemini LLM initialised with streaming=True.")
    return _llm


# =============================================================================
# JSON HELPERS
# =============================================================================

def _strip_markdown_fences(raw_text: str) -> str:
    cleaned = re.sub(r"```(?:json)?\s*", "", raw_text)
    cleaned = cleaned.replace("```", "")
    return cleaned.strip()


def _extract_json_object(text: str) -> dict:
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    start_index = text.find("{")
    end_index = text.rfind("}")

    if start_index == -1 or end_index == -1:
        raise ValueError(f"No JSON object found in Gemini response: {text[:300]}")

    json_substring = text[start_index: end_index + 1]

    try:
        return json.loads(json_substring)
    except json.JSONDecodeError as parse_error:
        raise ValueError(
            f"Could not parse JSON from Gemini response. "
            f"Error: {parse_error}. "
            f"Raw snippet: {json_substring[:300]}"
        )


def _build_fallback_response(student_question: str) -> dict:
    return {
        "topic": "error",
        "language": "en",
        "diagram_type": "default",
        "phases": [
            {
                "phase": 0,
                "name": "background",
                "diagram_action": "none",
                "speak": (
                    "I am having a small technical difficulty right now. "
                    "Please ask your question again and I will explain it properly."
                ),
                "key_point": None,
                "joke": None,
                "teacher_position": "left",
            },
            {
                "phase": 1,
                "name": "student_question",
                "diagram_action": "none",
                "speak": f"Your question was: {student_question}. Please try again.",
                "key_point": None,
                "wait_for_answer": True,
                "teacher_position": "center",
            },
        ],
    }


# =============================================================================
# SSE STREAMING GENERATOR
# =============================================================================

def _stream_teaching_phases(student_question: str, language: str):
    """
    Generator that:
      1. Calls RAG (fast, local, <1 second)
      2. Streams Gemini's response token by token
      3. When the full response is accumulated, parses it and yields SSE events

    Yields SSE-formatted strings for a StreamingHttpResponse.
    """
    from langchain_core.messages import SystemMessage, HumanMessage

    try:
        # Step 1: RAG retrieval (fast -- local sentence-transformers)
        logger.info(f"[PhysicsTeacher] RAG search for: '{student_question[:60]}'")
        rag_context = rag_search(student_question, top_k=4)

        # Step 1.5: Web search agent retrieval (Wikipedia + page images)
        from physics_teacher.search_agent import search_wikipedia
        logger.info(f"[PhysicsTeacher] Web search for: '{student_question[:60]}'")
        web_results = search_wikipedia(student_question, limit=2)

        # Step 2: Build system message
        system_content = PHYSICS_TEACHER_SYSTEM_PROMPT
        if rag_context:
            system_content += f"""

==================================
FACTUAL CONTEXT FROM COLLEGE PHYSICS 2E TEXTBOOK
==================================

Use the passages below to ensure your explanation is physically accurate.
Do NOT quote this text directly. Transform it into natural spoken teaching.
The student does not know where this context comes from.

{rag_context}
"""
        else:
            logger.warning(
                f"[PhysicsTeacher] No RAG context found for: '{student_question[:60]}'"
            )

        # Append Web search results if available
        if web_results:
            web_text = ""
            web_images = []
            for item in web_results:
                web_text += f"\nTitle: {item['title']}\nSummary: {item['extract']}\n"
                if item.get('image_url'):
                    web_images.append(item['image_url'])

            system_content += f"""

==================================
REAL-WORLD KNOWLEDGE & IMAGES FROM WEB SEARCH
==================================

Use the search results below to teach using real-life examples and diagrams.
We have found some relevant educational images from the web search. You should choose the best image URL from the list below and display it in the lesson!

TEXT SUMMARY:
{web_text}

IMAGE URLS AVAILABLE FOR DISPLAY:
{json.dumps(web_images)}

CRITICAL INSTRUCTIONS FOR DISPLAYING THESE IMAGES:
1. You MUST set the main "diagram_type" of the lecture to "image".
2. In every phase where you want the image to be shown on the board (Phases 2 and above, including derivation, but excluding the final question phase), you MUST add a "diagram_target" field directly to that phase object, set to the exact image URL from the list above. Do NOT invent URLs; use only the exact URLs provided in the list.
3. You MUST keep the "diagram_target" URL exactly the same across all of these phases (Phases 2 and above) so that the image stays on the screen. If you omit "diagram_target" in any phase, the image will disappear from the chalkboard!
4. In your spoken text, explain the details of what is shown in the image to make it feel like a real classroom lecture.
"""

        # Step 3: Language instruction
        language_instruction = (
            f"The student wrote their question in language code: '{language}'. "
            f"Teach in that language. Set the 'language' field in your JSON to '{language}'."
        )

        # Step 4: Stream Gemini response
        llm = _get_llm()
        messages = [
            SystemMessage(content=system_content),
            HumanMessage(content=f"{language_instruction}\n\nStudent question: {student_question}"),
        ]

        logger.info(f"[PhysicsTeacher] Starting Gemini stream for: '{student_question[:80]}'")

        # Send a heartbeat immediately so the client knows the request started
        yield f"data: {json.dumps({'status': 'thinking'})}\n\n"

        # Accumulate the full streamed text
        full_text = ""
        for chunk in llm.stream(messages):
            token = chunk.content
            if token:
                full_text += token

        logger.info(f"[PhysicsTeacher] Gemini stream complete. Response: {len(full_text)} chars")

        # Step 5: Parse and validate
        cleaned_text = _strip_markdown_fences(full_text)
        parsed_response = _extract_json_object(cleaned_text)

        parsed_response.setdefault("topic", student_question[:30])
        parsed_response.setdefault("language", language)
        parsed_response.setdefault("diagram_type", "default")
        parsed_response.setdefault("phases", [])

        # Ensure teacher_position defaults on every phase
        for i, phase in enumerate(parsed_response["phases"]):
            if "teacher_position" not in phase:
                if i == 0:
                    phase["teacher_position"] = "left"
                elif i == 1:
                    phase["teacher_position"] = "right"
                elif i == len(parsed_response["phases"]) - 1:
                    phase["teacher_position"] = "center"
                else:
                    phase["teacher_position"] = "left" if i % 2 == 0 else "right"

        if not isinstance(parsed_response["phases"], list):
            raise ValueError("'phases' is not a list.")

        logger.info(
            f"[PhysicsTeacher] Parsed {len(parsed_response['phases'])} phases "
            f"for topic: '{parsed_response.get('topic')}'"
        )

        # Step 6: Send the complete response as a single SSE event
        yield f"data: {json.dumps({'result': parsed_response})}\n\n"
        yield "data: [DONE]\n\n"

    except RuntimeError as config_error:
        logger.error(f"[PhysicsTeacher] Configuration error: {config_error}")
        yield f"data: {json.dumps({'error': str(config_error), 'code': 503})}\n\n"
        yield "data: [DONE]\n\n"

    except (ValueError, Exception) as e:
        logger.exception(f"[PhysicsTeacher] Stream error: {e}")
        fallback = _build_fallback_response(student_question)
        yield f"data: {json.dumps({'result': fallback})}\n\n"
        yield "data: [DONE]\n\n"


# =============================================================================
# DJANGO API VIEWS
# =============================================================================

class ExplainView(APIView):
    """
    POST /api/physics-teacher/explain/

    Returns a Server-Sent Events (SSE) stream.

    Events:
        data: {"status": "thinking"}          -- immediate heartbeat
        data: {"result": { ...phases... }}    -- complete teaching response
        data: [DONE]                          -- stream complete

    Request body:
        {
            "question": "what is projectile motion",
            "language": "en"   // optional, defaults to "en"
        }
    """

    def post(self, request):
        # Validate input
        student_question = request.data.get("question", "").strip()
        if not student_question:
            return Response(
                {
                    "error": "Field 'question' is required and cannot be empty.",
                    "hint": 'Send: { "question": "what is projectile motion" }',
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        language = request.data.get("language", "en").strip().lower()

        logger.info(
            f"[ExplainView] SSE stream requested: "
            f"question='{student_question[:80]}' language='{language}'"
        )

        # Return a streaming SSE response
        response = StreamingHttpResponse(
            _stream_teaching_phases(student_question, language),
            content_type="text/event-stream",
        )
        # Required headers for SSE
        response["Cache-Control"] = "no-cache"
        response["X-Accel-Buffering"] = "no"
        response["Access-Control-Allow-Origin"] = "*"
        return response


class HealthView(APIView):
    """
    GET /api/physics-teacher/health/

    Confirms the physics_teacher app is running and Gemini key is configured.
    """

    def get(self, request):
        api_key_configured = bool(os.getenv("GEMINI_API_KEY"))
        return Response(
            {
                "status": "ready" if api_key_configured else "missing_api_key",
                "app": "physics_teacher",
                "model": "gemini-2.5-flash",
                "rag": "college-physics-2e (sentence-transformers local)",
                "streaming": True,
                "api_key_configured": api_key_configured,
            },
            status=status.HTTP_200_OK,
        )
