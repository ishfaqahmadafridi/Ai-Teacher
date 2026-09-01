# Backend Rules (Django)

> Read this before modifying any Python file in `backend/`.

---

## 1. The Three-Layer Architecture — Always

Every Django app in this project MUST follow a strict three-layer separation:

```
Layer 1 — views.py       ROUTING ONLY    → validates input, calls services, returns response
Layer 2 — services/      BUSINESS LOGIC  → all LLM, RAG, session, parsing, fallback logic
Layer 3 — prompts/       CONFIGURATION   → all prompt text, templates, constants
```

### What each layer is allowed to contain:

| Layer | Allowed | Not Allowed |
|---|---|---|
| `views.py` | Input validation, status codes, calling services, returning Response | LLM calls, JSON parsing, session logic, prompt text |
| `services/*.py` | Business logic, LLM calls, JSON parsing, RAG calls, fallback logic | HTTP response objects, Django request handling |
| `prompts/*.py` | Prompt strings, template strings, constants | Any logic, any imports beyond standard lib |

---

## 2. Views Must Be Thin — 100 Lines Maximum

A view file that exceeds 100 lines is a signal that business logic has leaked into the routing layer.

```python
# ✅ CORRECT — views.py is pure routing
class ExplainView(APIView):
    def post(self, request):
        question = request.data.get('question', '').strip()
        if not question:
            return Response({'error': '...'}, status=400)

        # Delegate everything to the service layer
        return StreamingHttpResponse(
            stream_teaching_phases(question, language),
            content_type='text/event-stream',
        )

# ❌ WRONG — LLM logic embedded in the view
class ExplainView(APIView):
    def post(self, request):
        llm = ChatGoogleGenerativeAI(model='gemini-2.5-flash', ...)   # ← belongs in service
        messages = [SystemMessage(...), HumanMessage(...)]            # ← belongs in service
        for chunk in llm.stream(messages):                            # ← belongs in service
            ...
```

---

## 3. Services Have Public Names (No Leading Underscore)

Service functions must have public names so they can be imported and tested.

```python
# ✅ CORRECT — physics_teacher/services/streaming_service.py
def extract_json_object(text: str) -> dict:   # ← public, testable
    ...

def strip_markdown_fences(raw_text: str) -> str:  # ← public, testable
    ...

# ❌ WRONG — private name hides it from tests
def _extract_json_object(text: str) -> dict:  # ← cannot import in test without accessing private
    ...
```

---

## 4. Prompts Are Never Embedded in Views or Services

Any string longer than 5 lines that is sent to Gemini MUST live in `prompts/`.

```python
# ✅ CORRECT — physics_teacher/prompts/teaching_prompt.py
PHYSICS_TEACHER_SYSTEM_PROMPT = """
You are Prof. Gemini...
"""

# physics_teacher/services/streaming_service.py
from physics_teacher.prompts import PHYSICS_TEACHER_SYSTEM_PROMPT

# ❌ WRONG — 300-line string embedded in views.py or services
PHYSICS_TEACHER_SYSTEM_PROMPT = """   # ← inside views.py
You are Prof. Gemini...
"""
```

---

## 5. Every Package Has a Barrel `__init__.py`

Every `services/` and `prompts/` package must export its public API from `__init__.py`.

```python
# ✅ CORRECT — physics_teacher/services/__init__.py
from .streaming_service import (
    get_llm,
    strip_markdown_fences,
    extract_json_object,
    build_fallback_response,
    stream_teaching_phases,
)

__all__ = [
    'get_llm', 'strip_markdown_fences', 'extract_json_object',
    'build_fallback_response', 'stream_teaching_phases',
]
```

---

## 6. Settings NEVER Contain Hardcoded Secrets

Every value that differs between development and production MUST come from `os.environ.get()`.

```python
# ✅ CORRECT — config/settings.py
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'dev-fallback-only')
DEBUG = os.environ.get('DJANGO_DEBUG', 'True').lower() in ('true', '1', 'yes')
ALLOWED_HOSTS = [h.strip() for h in os.environ.get('DJANGO_ALLOWED_HOSTS', 'localhost').split(',')]

# ❌ NEVER
SECRET_KEY = 'django-insecure-abc123'
DEBUG = True
ALLOWED_HOSTS = ['*']
```

---

## 7. Session Store Is Swap-Ready for Redis

The current in-memory session store in `teacher/services/session_service.py` is isolated by design. When migrating to Redis:

```python
# Replace these two lines in session_service.py:
from django.core.cache import cache

def get_session(session_id: str) -> list[dict]:
    return cache.get(f'session:{session_id}', [])

def save_session(session_id: str, history: list[dict]) -> None:
    cache.set(f'session:{session_id}', history[-MAX_HISTORY_LENGTH:], timeout=3600)
```

**Do NOT** touch `inference.py` or `views.py` when doing this migration.

---

## 8. RAG Is Non-Blocking — Never Call Inside a Request Synchronously

The `rag.py` module uses a background init thread. The `search()` function gracefully returns `""` if the collection is not yet ready. This is intentional.

```python
# ✅ CORRECT — always call rag.search() knowing it may return ""
rag_context = rag_search(question, top_k=4)
if rag_context:
    # augment prompt
    ...
# If empty, Gemini answers from its own knowledge — this is by design

# ❌ WRONG — blocking the RAG init inside a request
def get_collection():
    # ...long operation...    ← times out in 60s, blocks the entire request
```

---

## 9. Tests Are Required for Every App

The minimum test coverage for any Django app is:

| File | What to test |
|---|---|
| `tests/test_views.py` | Every endpoint: 400 on invalid input, 200 on valid input, correct response shape |
| `tests/test_<service>.py` | Every service function with: happy path, edge cases, error cases |

Tests must use `unittest.mock.patch` to mock LLM calls — never make real API calls in tests.

---

## 10. Module Docstrings on Every File

Every Python file must start with a module-level docstring that explains:
1. What the module's responsibility is
2. WHY it exists as a separate file (the architectural reason)
3. Any non-obvious constraints or design decisions

```python
# ✅ CORRECT
"""
teacher/services/session_service.py

In-process session store for conversation history.

WHY A SEPARATE SERVICE:
    Isolating the session store here means swapping to Redis in production
    requires changing only this file — inference.py and views.py are untouched.

PRODUCTION NOTE:
    Replace the dict below with Django's cache framework...
"""

# ❌ WRONG — no docstring, or too generic
"""Session service."""
```

---

## 11. Real Database Persistence Standard

- **Every persistent domain entity MUST have an ORM Model and Database Migration.**
- User-created or mutated data (timetable entries, assignments, user settings, registrations) must ALWAYS be persisted into the database through the service layer (`services/`).
- Never leave persistent data in temporary static dictionaries or in-memory arrays when an ORM model is required.
- All database mutation operations must be validated through Django REST Framework serializers and documented with OpenAPI `@extend_schema`.

---

## Backend Checklist for Every Change

Before submitting any Python change, verify:

- [ ] `views.py` is ≤100 lines and contains no business logic
- [ ] All business logic is in `services/`
- [ ] All database mutations are persisted to ORM models through `services/`
- [ ] All prompt strings >5 lines are in `prompts/`
- [ ] No secrets or hardcoded values in `settings.py`
- [ ] Tests written for any new service function
- [ ] Module docstring added to any new file
- [ ] Barrel `__init__.py` updated if a new service was added

