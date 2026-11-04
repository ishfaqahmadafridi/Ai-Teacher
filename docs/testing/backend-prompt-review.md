# Backend and system prompt review — 4 November 2026

The classroom backend had concrete architectural and response-integrity problems. This update repairs the findings below. It is not a certification that the entire backend meets every engineering rule or that model output is always correct.

## Django classroom changes

- A dedicated teaching-message service composes the trusted teaching policy. Student profile values, saved curriculum labels, textbook excerpts, research sources and image metadata are supplied in a separate reference-data message. Conversation history retains its human/assistant roles; the current question is last. Static scheduled-lesson, visual and research policies remain in the system message without interpolating untrusted values there.
- The system prompt's supported diagram actions come from the backend action registry. It explicitly addresses embedded instruction attempts and preserves existing teaching, language, practice, uncertainty and visual constraints.
- Visual retrieval policy moved from a service string into the prompts package. FastAPI streaming and conversational workflow nodes now reuse one prose teaching prompt rather than separate copies.
- Malformed optional animation speed/metadata is discarded without rejecting valid narration. Unknown scene names fall back to the supported default. Assessment criteria without a question are rejected; feedback cannot declare an answer understood while listing missing concepts.
- Optional textbook retrieval failures no longer discard an otherwise valid model-generated lesson. Failed retrieval is recorded in metadata and never described as verified evidence.
- Blocking lesson generation/validation/note-saving orchestration moved into a service; authenticated blocking requests receive the same student teaching context as queued requests. Error handling now also covers note persistence.
- Evaluation ownership lookup moved from the HTTP view into its service. All classroom view modules are below the repository's 100-line limit, and the final scan found no direct ORM lookups in those view modules.

## FastAPI integrity changes and compatibility impact

The separate legacy workflow returned a fixed 92/100 grade, a fixed physics quiz, invented textbook passages/chapter citations, a preset solution on solver failure and a preset physics answer after workflow errors. The grading helper could invent a 90% grade when structured results were missing. The timetable helper could add unregistered course names.

Those responses are removed. Tutor/solver failures now become a controlled HTTP 503 rather than a substitute answer or exposed exception. Retrieval uses the shared bounded retrieval service and supplies no invented chapter citations. A critic substring check no longer claims mathematical verification. Empty course inputs no longer create synthetic registrations. Streaming errors use a generic interruption message; text content blocks use the model's normalized text accessor.

**Legacy scored assignment grading and quiz workflow branches now return 503.** Their former responses were fixtures, not real implementations. This update does not implement a new rubric-scoring or quiz-generation service. Django's existing persisted understanding-check evaluation remains available and passed its tests. No frontend reference to the legacy FastAPI grading endpoint was found in the source scan.

Legacy FastAPI graph state and metadata still use permissive dictionary/`Any` types in several modules; this review does not certify full type-policy compliance there. The keyword intent router is heuristic, and its fixed confidence values are not calibrated probabilities.

The standalone safety-check helper now calls its deterministic check directly rather than running a tutoring workflow. This keyword check remains limited; it is not a comprehensive content-safety classifier. The preview planner remains a preview, not the authoritative persisted timetable or a verified external-availability optimizer.

## Executed verification

- Django users/dashboard/classroom suite: **278 passed**.
- FastAPI application suite: **33 passed**.
- Additional FastAPI planner/security/retrieval suite: **19 passed**.
- Frontend behavior/regression suite: **151 passed**.
- Whitespace validation: passed.

Coverage includes message-role/data boundaries with injected strings, registry/prompt agreement, malformed optional diagrams, contradictory assessment feedback, optional retrieval outage, ownership-protected evaluation, unavailable grading/quiz behavior, real retrieval delegation, generic HTTP/stream failure output and the absence of synthetic registrations. Existing HTTP tests use real Django/FastAPI request routing with controlled model boundaries. Provider-dependent FastAPI tests now use deterministic mocked models instead of accidentally relying on configured live credentials. Import-order testing exposed a new retrieval/service cycle, which was repaired before the final successful suites.

Reproduction from the repository root:

```sh
(cd backend/django_app && .venv/bin/python manage.py test apps.users apps.dashboard apps.classroom --settings=config.settings.test --noinput)
PYTHONPATH=backend/fastapi_app:backend/django_app:backend backend/django_app/.venv/bin/python -m unittest discover -s backend/fastapi_app/app/tests
PYTHONPATH=backend/fastapi_app:backend/django_app:backend backend/django_app/.venv/bin/python -m unittest discover -s backend/fastapi_app/tests
(cd frontend && npm run test:regressions)
```

These tests verify deterministic contracts and failure behavior. They do not establish that every prompt injection is resisted, that every generated lesson is pedagogically/scientifically correct, or that live provider/broker/deployment behavior supports 1,000 simultaneous users. No live AI generation or production load test was performed in this review. The FastAPI test client emits an existing Starlette/httpx deprecation warning.
