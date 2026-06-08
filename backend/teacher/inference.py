"""
Physics teacher inference service.

Takes a student question, retrieves relevant textbook passages from RAG,
and sends them to Gemini 2.5 Flash with a strict system prompt that forces
a structured JSON response (list of "chunks" with speak + diagram actions).
"""
import os
import re
import json
import logging
from typing import Optional
from dotenv import load_dotenv

logger = logging.getLogger(__name__)
load_dotenv()

# ─────────────────────────────────────────────────────────────────────────────
# SYSTEM PROMPT — forces Gemini to behave like a real professor and return JSON
# ─────────────────────────────────────────────────────────────────────────────
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
  BAD:  "Newton's First Law states that..."
  GOOD: "Imagine you're on a frozen lake and you push a rock — it slides forever. Why does it do that?"

RULE 2 — Real analogy BEFORE any concept. Use things from daily life.
  BAD:  "Electric current is the flow of electrons."
  GOOD: "Think of electricity like water in a pipe. Voltage is the water pressure. Current is how fast the water flows."

RULE 3 — Always explain the WHY, not just the WHAT.
  The phrase "This happens BECAUSE..." must appear in your explanation.

RULE 4 — Short spoken sentences. Conversational style. NOT textbook style.
  BAD:  "The gravitational force between two objects is proportional to the product of their masses."
  GOOD: "More mass means more pull. That simple. Earth pulls you harder than the Moon because Earth is way more massive."

RULE 5 — Add one light joke or fun moment to keep the student awake.
  Example: "Yes, even your physics professor drops things sometimes. Gravity has no favorites."
  Example: "Don't fall asleep — this next part is actually interesting, I promise!"

RULE 6 — Formula comes LAST, after the student already understands the idea.
  Explain the concept with words and analogies first. Then say:
  "Scientists packed all of that into just a few letters: F = ma."

RULE 7 — Point to the diagram while explaining. Use diagram actions.
  Each chunk should coordinate with what the student sees on screen.

RULE 8 — End with ONE question to check the student's understanding.
  Example: "So quick question — if I double the mass, what happens to the force? Think about it."

RULE 9 — Detect the student's language automatically from their question.
  If the question is in Urdu, speak in Urdu. If English, speak in English.
  Supported: English, Urdu, Arabic, Hindi, French.

RULE 10 — MAX 3-4 short sentences per chunk. Never a wall of text.
  Each chunk should feel like one natural pause in a real lecture.

## DIAGRAM TYPES — choose the best one for the topic:
- "gravity"        → planet with force arrows
- "electric_field" → point charges with field lines  
- "projectile"     → ball trajectory with velocity vectors
- "wave"           → sine wave animation
- "circuit"        → simple circuit loop
- "atom"           → Bohr model with nucleus + electrons
- "default"        → generic rotating sphere with arrows

## EXAMPLE RESPONSE (for "What is gravity?"):

{
  "chunks": [
    {
      "speak": "Okay! Quick question first — have you ever dropped your phone and felt that moment of panic? That feeling? That is gravity doing its job.",
      "diagram": { "action": "none" }
    },
    {
      "speak": "Now look at this diagram. You can see the Earth pulling everything toward its center. That pull is what we call gravity.",
      "diagram": { "action": "highlight", "target": "earth" }
    },
    {
      "speak": "Here is the key thing — the bigger the object, the stronger the pull. This happens BECAUSE more mass means more of this attractive force.",
      "diagram": { "action": "rotate", "speed": "slow" }
    },
    {
      "speak": "Yes, even your physics professor drops their coffee sometimes. Gravity truly has no favorites!",
      "diagram": { "action": "none" }
    },
    {
      "speak": "Now scientists wrote all of this as one beautiful formula. F equals G times M times m, divided by r squared. Now you know what every single letter means.",
      "diagram": { "action": "show_formula", "formula": "F = \\frac{GMm}{r^2}" }
    },
    {
      "speak": "So here is my question for you — if the Earth were twice as massive, would you feel heavier, lighter, or the same? Think about it!",
      "diagram": { "action": "none" }
    }
  ],
  "topic": "gravity",
  "diagram_type": "gravity",
  "language": "en"
}
"""

# ── In-memory session store ───────────────────────────────────────────────────
# Maps session_id → list of {role, content} message dicts
_sessions: dict[str, list[dict]] = {}

# ── LLM singleton ─────────────────────────────────────────────────────────────
_llm = None


def get_llm(temperature: float = 0.7):
    """
    Lazily initialise the Gemini 2.5 Flash LLM (singleton).
    Returns a LangChain ChatGoogleGenerativeAI instance.
    """
    from langchain_google_genai import ChatGoogleGenerativeAI
    global _llm
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        logger.warning("GEMINI_API_KEY not set in environment.")
    if _llm is None:
        _llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=api_key,
            temperature=temperature,
        )
    return _llm


def _extract_json(raw: str) -> dict:
    """
    Extract and parse the JSON object from Gemini's raw response string.

    Gemini sometimes wraps JSON in markdown fences — this strips them.
    Returns the parsed dict, or raises ValueError if parsing fails.
    """
    # Strip markdown code fences if present
    cleaned = re.sub(r"```(?:json)?\s*", "", raw).replace("```", "").strip()

    # Try direct parse
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # Find first '{' ... last '}' as fallback
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start != -1 and end != -1:
        try:
            return json.loads(cleaned[start : end + 1])
        except json.JSONDecodeError:
            pass

    raise ValueError(f"Could not parse JSON from Gemini response: {raw[:200]}")


def _fallback_chunks(question: str) -> dict:
    """
    Return a safe fallback response when Gemini fails or returns invalid JSON.
    Ensures the frontend always receives a valid chunks array.
    """
    return {
        "chunks": [
            {
                "speak": "I am having a little technical difficulty right now. Please ask your question again and I will explain it properly.",
                "diagram": {"action": "none"},
            }
        ],
        "topic": "unknown",
        "diagram_type": "default",
        "language": "en",
    }


def generate_answer(
    question: str,
    session_id: str = "default",
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
        question:   The student's message.
        session_id: Unique session ID for conversation memory.
        temperature: Sampling temperature.

    Returns:
        dict with keys: chunks (list), topic (str), diagram_type (str),
        language (str), tokens_used (int), model_info (dict)
    """
    from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
    from teacher.rag import search as rag_search

    llm = get_llm(temperature)

    # ── RAG: get relevant textbook context ────────────────────────────────────
    rag_context = rag_search(question, top_k=3)

    # ── Build system message with RAG context injected ────────────────────────
    system_with_context = SYSTEM_PROMPT
    if rag_context:
        system_with_context += f"""

## RELEVANT TEXTBOOK CONTEXT (from College Physics 2e)
Use this context to make your explanation accurate. Do NOT quote it verbatim.
Turn it into natural spoken teaching:

{rag_context}
"""

    # ── Get or create session history ─────────────────────────────────────────
    if session_id not in _sessions:
        _sessions[session_id] = []
    history = _sessions[session_id]

    # ── Build messages list ────────────────────────────────────────────────────
    messages = [SystemMessage(content=system_with_context)]
    for entry in history:
        if entry["role"] == "user":
            messages.append(HumanMessage(content=entry["content"]))
        else:
            messages.append(AIMessage(content=entry["content"]))
    messages.append(HumanMessage(content=question))

    # ── Call Gemini ────────────────────────────────────────────────────────────
    try:
        response = llm.invoke(messages)
        raw_answer = response.content

        # Parse structured JSON from response
        try:
            parsed = _extract_json(raw_answer)
        except ValueError as parse_err:
            logger.error(f"[Inference] JSON parse error: {parse_err}")
            parsed = _fallback_chunks(question)

        # Ensure required keys exist
        parsed.setdefault("chunks", [])
        parsed.setdefault("topic", "physics")
        parsed.setdefault("diagram_type", "default")
        parsed.setdefault("language", "en")

        # Save to session history (store raw answer for continuity)
        history.append({"role": "user", "content": question})
        history.append({"role": "assistant", "content": raw_answer})

        # Bound history to last 20 exchanges (40 messages)
        if len(history) > 40:
            _sessions[session_id] = history[-40:]

        return {
            "chunks": parsed["chunks"],
            "topic": parsed["topic"],
            "diagram_type": parsed["diagram_type"],
            "language": parsed["language"],
            "tokens_used": len(raw_answer.split()),
            "model_info": {
                "architecture": "LangChain-Gemini-RAG",
                "model_type": "gemini-2.5-flash",
                "source": "college-physics-2e",
                "session_id": session_id,
                "rag_used": bool(rag_context),
            },
        }

    except Exception as e:
        logger.error(f"[Inference] Gemini API error: {e}")
        fallback = _fallback_chunks(question)
        return {
            **fallback,
            "tokens_used": 0,
            "model_info": {"error": str(e)},
        }


def clear_session(session_id: str) -> None:
    """Remove conversation history for the given session ID."""
    _sessions.pop(session_id, None)
