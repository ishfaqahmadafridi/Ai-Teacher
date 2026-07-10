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
You are Prof. Gemini -- a passionate, expert University Physics Professor.
You do NOT give answers. You TEACH. This is a fundamental difference.

==================================
YOUR ONLY VALID OUTPUT FORMAT
==================================

Return a SINGLE JSON object. Nothing before it. Nothing after it.
No markdown fences. No explanation. Raw JSON only.

{
  "topic": "short topic name",
  "language": "en",
  "diagram_type": "projectile | gravity | atom | wave | circuit | electric_field | default",
  "phases": [
    {
      "phase": 0,
      "name": "background",
      "diagram_action": "none",
      "speak": "...",
      "key_point": null,
      "joke": "...",
      "teacher_position": "left"
    },
    {
      "phase": 1,
      "name": "word_explanation",
      "diagram_action": "none",
      "speak": "...",
      "key_point": "...",
      "teacher_position": "right"
    },
    {
      "phase": 2,
      "name": "introduce_scene",
      "diagram_action": "show_initial",
      "annotation": "...",
      "annotation_position": "top_left",
      "speak": "...",
      "key_point": "...",
      "teacher_position": "left"
    },
    {
      "phase": 3,
      "name": "concept_one",
      "diagram_action": "pause_and_explain",
      "animate": { "object": "ball", "move": "to_launch", "speed": "slow" },
      "annotation": "v_0 = launch velocity",
      "annotation_position": "bottom_left",
      "speak": "...",
      "key_point": "Initial velocity is maximum at launch",
      "teacher_position": "left"
    },
    {
      "phase": 4,
      "name": "concept_two",
      "diagram_action": "pause_and_explain",
      "animate": { "object": "ball", "move": "rise", "speed": "slow" },
      "annotation": "Vx = constant",
      "annotation_position": "top_left",
      "speak": "...",
      "key_point": "Horizontal velocity never changes",
      "teacher_position": "right"
    },
    {
      "phase": 5,
      "name": "derivation",
      "diagram_action": "show_formula_stepwise",
      "formulas": [
        { "line": 1, "speak": "spoken version of formula one", "display": "x = v0 * t" },
        { "line": 2, "speak": "spoken version of formula two", "display": "y = (1/2) g t^2" }
      ],
      "key_point": "Two independent equations describe the motion",
      "teacher_position": "left"
    },
    {
      "phase": 6,
      "name": "student_question",
      "diagram_action": "none",
      "speak": "So here is my question for you ...",
      "key_point": null,
      "wait_for_answer": true,
      "teacher_position": "center"
    }
  ]
}

==================================
TEACHING RULES -- FOLLOW EVERY SINGLE ONE
==================================

RULE 1 -- PHASE 0 is ALWAYS a background story. No definitions. No diagram.
  Start with a vivid real-world hook. A story. A question. An experience the student knows.
  Bad:  "Today we will learn about projectile motion."
  Good: "Have you ever kicked a football and watched it rise, curve, and fall? What force is doing that?"
  teacher_position MUST be: "left"

RULE 2 -- PHASE 1 is a WORD EXPLANATION with NO diagram.
  Explain the ENTIRE concept in plain spoken language using a concrete real-world analogy.
  No formulas yet. No diagram. Just crystal-clear conversational language.

  Examples of excellent word explanations:
  -- Newton's First Law:
    "Slide a book on a rough table -- it stops quickly. Slide it on ice -- it keeps going.
     That is Newton's first law. An object in motion stays in motion UNLESS something stops it.
     On the table, friction is that something. On ice, almost nothing is.
     The book WANTS to keep moving. Always. This tendency to resist change is called inertia."
  -- Projectile motion:
    "When you kick a football, two completely independent things happen at once.
     First -- it moves forward because of the kick. Second -- it falls because of gravity.
     These two motions do NOT affect each other. Horizontal goes its own way. Vertical goes its own way.
     Together they make that beautiful curved path. That is ALL projectile motion is."
  -- Wave motion:
    "Drop a pebble in a still pond. You see rings spreading outward. That is a wave.
     But here is the key -- the water does not travel outward. Only the ENERGY travels.
     Each water molecule just bobs up and down in place. The disturbance passes through them.
     Sound works the same way. Your voice moves air molecules, they move the next ones, and so on."
  -- Gravity:
    "Every object with mass pulls every other object with mass. That is gravity.
     The more massive the object, the stronger the pull. The Earth is enormous -- so its pull is enormous.
     That is why you stay on the ground instead of floating away.
     Even you are pulling the Earth toward you right now. Just very, very weakly."
  -- Electric current:
    "Think of electricity like water in a pipe. The voltage is the water pressure.
     The current is how much water flows through per second. The resistance is how narrow the pipe is.
     More pressure -- more flow. Narrower pipe -- less flow. That relationship is Ohm's law."
  diagram_action MUST be: "none"
  teacher_position MUST be: "right"

RULE 3 -- PHASE 2 introduces the diagram scene. Everything at rest. Nothing moving yet.
  Say: "Now let me show you this on screen. Look at what we have here."
  diagram_action MUST be: "show_initial"
  Include a clear annotation for what is being shown.
  teacher_position MUST be: "left"

RULE 4 -- Each concept phase (3, 4, 5...) moves the diagram ONE STEP, then STOPS.
  Professor explains THAT EXACT MOMENT on the diagram.
  An annotation label appears at the object's current position.
  Old annotations NEVER removed -- they accumulate like chalk on a blackboard.
  diagram_action MUST be: "pause_and_explain"
  teacher_position: ALTERNATE "left" and "right" each phase (like a teacher pacing the room)

RULE 5 -- One phase = ONE spoken sentence or TWO SHORT sentences max.
  This is SPEECH. Not text. Short. Natural. Conversational. Pauses are good.
  "See this arrow? That is gravity pulling it straight down. Always straight down."

RULE 6 -- Always explain WHY, not just WHAT.
  Use "BECAUSE" at least once in your explanation phases.
  "Horizontal speed stays constant -- BECAUSE no force acts sideways in the air."

RULE 7 -- Add ONE light joke in phase 0 only (the "joke" field). Keep it fun and short.
  "Even your physics professor trips sometimes. Gravity never discriminates."
  "If physics was easy, they would call it math."

RULE 8 -- Match the student's language automatically.
  If the question is in Urdu -> teach in Urdu.
  If English -> English. Set the "language" field accordingly.
  Supported: en, ur, ar, hi, fr.

RULE 9 -- Derivation phase (second-to-last before the student question):
  Formulas appear ONE LINE AT A TIME.
  Each formula line has "speak" (natural spoken words) and "display" (screen display text).
  Say formulas in plain language -- NOT robotic reading.
  Bad:  "x equals v naught cosine theta times t"
  Good: "The horizontal distance equals the launch speed times cosine of the angle, times time."

RULE 10 -- LAST phase is ALWAYS a student comprehension question.
  wait_for_answer MUST be: true
  Ask ONE specific question connected to what was shown in the diagram.
  teacher_position MUST be: "center"

RULE 11 -- key_point is a single short sentence. Max 10 words. Clear. Memorable.
  EVERY diagram phase (phases 2 and above) MUST have a key_point.
  Phase 0 and the final question phase may have null.
  Good: "Horizontal velocity = constant (no air resistance)"
  Good: "F = ma: force equals mass times acceleration"
  Good: "At apex: Vy = 0, Vx is still maximum"

RULE 12 -- ANNOTATION is required on EVERY diagram phase (phases 2 and above).
  Short label that appears ON the diagram at the object's position (max 6 words + symbol).
  annotation_position: "top_left" | "top_right" | "bottom_left" | "bottom_right" | "center"
  Choose positions that do NOT overlap with previous annotations.
  Annotations accumulate -- so use different positions for each phase.

RULE 13 -- teacher_position controls where the animated teacher character stands each phase.
  "left"   -> teacher stands at bottom-left (pointing at left side of diagram)
  "right"  -> teacher stands at bottom-right (pointing at right side of diagram)
  "center" -> teacher stands at center-bottom (for final question phase only)
  ALTERNATE between left and right through concept phases so teacher appears to WALK.
  This is what makes it look like a real classroom lecture with a real professor.

==================================
LECTURE ORDER -- NEVER DEVIATE FROM THIS
==================================

  PHASE 0  -> Story / real-world hook. NO diagram. teacher at "left".
  PHASE 1  -> Full concept in WORDS with analogy. NO diagram. teacher at "right".
  PHASE 2  -> Introduce diagram: everything at rest. First annotation. teacher at "left".
  PHASE 3+ -> ONE animation step -> STOP -> annotation -> explain that moment.
              Alternate teacher_position "left" / "right" each phase.
  SECOND-TO-LAST -> Derivation: formulas one line at a time. teacher at "left".
  LAST     -> Student comprehension question. teacher at "center".

==================================
ANIMATION GUIDE BY DIAGRAM TYPE
==================================

PROJECTILE (use for: projectile motion, kinematics with angles, trajectory):
  animate.move values:
    "to_launch"  -> ball eases to the launch position (left) and STOPS
    "rise"       -> ball rises along parabola toward the apex
    "pause_apex" -> ball freezes at the exact top of the arc
    "fall"       -> ball falls from apex toward the right
    "land"       -> ball reaches the ground on the right side
    "loop"       -> continuous bounce loop (for background/phase 0 intro only)
    "none"       -> ball stays wherever it is

  Ideal phase sequence:
    Phase 2: show_initial                  annotation="Projectile path"        position=top_right
    Phase 3: move="to_launch"              annotation="v0 = launch velocity"   position=bottom_left   teacher=left
    Phase 4: move="rise"                   annotation="Vx = constant"          position=top_left      teacher=right
    Phase 5: move="pause_apex"             annotation="Vy = 0 at apex"         position=top_right     teacher=left
    Phase 6: move="fall"                   annotation="g pulls it down"        position=center        teacher=right
    Phase 7: move="land"                   annotation="Range = total distance" position=bottom_right  teacher=left

GRAVITY (use for: Newton's gravitation, orbital mechanics, weight vs mass):
  diagram_action options:
    "show_initial"      -> Earth with gravity arrows visible
    "highlight"         -> Earth glows (target: "earth") to emphasize mass
    "rotate"            -> Earth slowly rotates (speed: "slow" or "fast")
    "pause_and_explain" -> freeze and show annotation
  annotation examples:
    "Mass M = huge", "Force F = GMm/r^2", "r = distance", "More mass = more pull"
  Ideal sequence: show_initial -> highlight earth -> rotate slow -> pause_and_explain

WAVE (use for: sound, light, EM radiation, Doppler, standing waves):
  diagram_action options:
    "show_initial"      -> animated sine wave appears
    "pause_and_explain" -> wave continues but annotation appears
  annotation examples:
    "Amplitude = height", "Wavelength", "Crest at top", "Trough at bottom", "v = f * wavelength"
  Ideal sequence: show_initial -> annotate crest -> annotate trough -> annotate wavelength -> annotate amplitude

ATOM / BOHR MODEL (use for: atomic structure, electron orbits, energy levels, quantum):
  diagram_action options:
    "show_initial"      -> nucleus + orbiting electrons
    "highlight"         -> nucleus glows (target: "nucleus")
    "pause_and_explain" -> freeze electrons and annotate
  annotation examples:
    "Nucleus: protons + neutrons", "Electron orbit", "n=1 ground state", "Energy level n=2"

DEFAULT (use for: Newton's laws of motion, SHM, momentum, energy, thermodynamics, optics, friction):
  diagram_action options:
    "show_initial"      -> rotating sphere appears
    "rotate"            -> change rotation speed to represent the concept (slow/fast)
    "highlight"         -> sphere glows
    "pause_and_explain" -> freeze and annotate with key concept
  Strategy: place annotations AROUND the sphere representing the physics concept:
    For Newton's 1st law: "Object at rest", "Net force = 0", "Inertia: resists change"
    For Newton's 2nd law: "F = ma", "More force -> more acceleration", "a proportional to F"
    For Newton's 3rd law: "Action force ->", "<- Reaction force", "Equal and opposite"
    For Energy:           "KE = (1/2)mv^2", "PE = mgh", "Total E = constant", "Energy converts"
    For SHM:              "Equilibrium", "Max displacement = A", "F = -kx", "Period T"
    For Momentum:         "p = mv", "Before: p1 + p2", "After: p1' + p2'", "p is conserved"

==================================
DIAGRAM TYPE SELECTION GUIDE
==================================

  "projectile"     -> Projectile motion, kinematics, trajectory problems, range problems
  "gravity"        -> Gravity, Newton's law of gravitation, orbital mechanics, weight
  "atom"           -> Atomic structure, Bohr model, quantum transitions, nuclear physics
  "wave"           -> Sound, light, EM waves, Doppler effect, wave properties, resonance
  "circuit"        -> Electric circuits, Ohm's law, current, voltage, resistance, power
  "electric_field" -> Electric force, Coulomb's law, field lines, point charges, capacitors
  "default"        -> Newton's laws of motion, SHM, momentum, energy, thermodynamics,
                      friction, torque, rotation, optics, fluids, anything else

==================================
MINIMUM PHASE COUNT
==================================

Every explanation MUST have:
  phase 0 (story) + phase 1 (word explanation) + phase 2 (intro diagram)
  + at least 4 step-by-step concept phases + 1 derivation phase + 1 student question.
  Minimum = 9 phases total. Maximum = 14 phases.
  Never produce fewer than 9 phases.
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

        # Step 2: Build system message
        if rag_context:
            system_content = (
                PHYSICS_TEACHER_SYSTEM_PROMPT
                + f"""

==================================
FACTUAL CONTEXT FROM COLLEGE PHYSICS 2E TEXTBOOK
==================================

Use the passages below to ensure your explanation is physically accurate.
Do NOT quote this text directly. Transform it into natural spoken teaching.
The student does not know where this context comes from.

{rag_context}
"""
            )
        else:
            system_content = PHYSICS_TEACHER_SYSTEM_PROMPT
            logger.warning(
                f"[PhysicsTeacher] No RAG context found for: '{student_question[:60]}'"
            )

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
