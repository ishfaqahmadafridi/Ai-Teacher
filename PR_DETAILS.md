# PR #102: Backend Teacher App Modularization & 3-Layer Architecture

This PR standardizes the `teacher` app in `backend/django_app/teacher/` to adhere strictly to the project's engineering rules (`AGENTS.md` and `backend-rules.md`). It converts all app modules into package directories, resolves test discovery conflicts, and enforces a non-blocking 3-Layer Architecture.

## Changes Included

### 1. Package Directory Standardization
Converted all single-file modules inside `teacher` into dedicated package directories with canonical `__init__.py` barrel exports:
* **`teacher/serializers/`**: `ask_serializers.py` containing `AskRequestSerializer` and `AskResponseSerializer`.
* **`teacher/prompts/`**: `teacher_prompts.py` containing `SYSTEM_PROMPT` and `RAG_CONTEXT_SUFFIX` (Layer 3 configuration).
* **`teacher/models/`**: `teacher_models.py` with docstrings clarifying non-ORM ChromaDB usage.
* **`teacher/admin/`**: `teacher_admin.py` with docstrings for admin registrations.
* **`teacher/services/`**: `llm_service.py` (with per-temperature caching & retry timeouts) and `session_service.py` (Layer 2 business logic).
* **`teacher/views/`**: `ask_view.py`, `health_view.py`, and `session_view.py` (Layer 1 thin routing).

### 2. Test Discovery Fix & Verification
* **Deleted `teacher/tests.py`**: Removed legacy 4-line file that was shadowing `teacher/tests/` and causing `ImportError` on `manage.py test teacher`.
* **100% Passing Test Suite**: Verified all **23 unit tests pass in 0.018s** with zero mock leakage.

### 3. Non-Blocking RAG & Security Hardening
* **Non-blocking Startup**: Background thread initialization in `apps.py` prevents first-request timeouts on model/ChromaDB loading.
* **Security Enforcement**: Added `DJANGO_SECRET_KEY` validation check in `base.py` for production mode (`DEBUG=False`).

## Verification
* Executed `./.venv/bin/python manage.py test teacher` -> **23/23 tests passed**.
