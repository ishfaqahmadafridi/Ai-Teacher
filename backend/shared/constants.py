"""
backend/shared/constants.py
Shared constants used across Django and FastAPI services following AGENTS.md rules.
"""

PROJECT_NAME = "AI Physics Teacher — NeuroLearn"
DEFAULT_PAGE_SIZE = 20
DEFAULT_LLM_MODEL = "gemini-2.5-flash"
DEFAULT_LLM_TEMPERATURE = 0.7

# ── Safety & Moderation Constants ─────────────────────────────────────────────
FORBIDDEN_TERMS = ["abuse", "hate", "spam", "hack", "cheat", "exploit", "attack"]
SAFETY_WARNING_MESSAGE = "⚠️ Classroom Safety Notice: Please maintain respectful academic decorum in the classroom."

# ── Intent Router Keywords ────────────────────────────────────────────────────
INTENT_ASSIGNMENT_KEYWORDS = ["grade", "assignment", "homework", "evaluate"]
INTENT_QUIZ_KEYWORDS = ["quiz", "test me", "practice question"]
INTENT_PLANNER_KEYWORDS = ["timetable", "schedule", "study plan"]
INTENT_MATH_OPERATORS = ["=", "+", "-", "*", "/", "^"]
INTENT_MATH_KEYWORDS = ["calculate", "solve"]
INTENT_KNOWLEDGE_KEYWORDS = ["textbook", "chapter", "definition", "what is"]

# ── Intent Node Mapping ───────────────────────────────────────────────────────
INTENT_NODE_MAPPING = {
    "tutor": "tutor_node",
    "knowledge": "retrieval_node",
    "math": "solver_node",
    "assignment": "grader_node",
    "quiz": "quiz_node",
    "study_plan": "planner_node",
}

# Pinned artifacts preserve compatibility with existing all-MiniLM FAISS snapshots.
MINILM_MODEL_NAME = 'sentence-transformers/all-MiniLM-L6-v2'
MINILM_REPOSITORY = 'qdrant/all-MiniLM-L6-v2-onnx'
MINILM_REVISION = 'd13954661f83248295ba75c1ed411eef3b7b936e'
MINILM_MAX_TOKENS = 256
MINILM_DIMENSIONS = 384
