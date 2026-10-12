# Adaptive classroom implementation

## Delivery order

1. Reliable playback: board points appear only when narration starts; speech failures stop visibly. Consolidate playback ownership before enabling student interruption across components.
2. Durable interactive lessons: account-owned lesson, versioned plan, ordered events, pending question, answer attempts and evaluation evidence. The server authorizes every resume and serializes updates per lesson.
3. LangGraph teaching workflow: prepare, teach, interrupt for a student answer, evaluate against a rubric, hint/reteach or continue. Use PostgreSQL checkpoints and stable server-owned thread IDs. Keep application progress in Django-owned records.
4. Live delivery: FastAPI SSE for ordered teacher events, authenticated HTTP commands for student answers/cancellation. Reconnect using event sequence; reject stale lesson revisions and duplicate commands.
5. Selective tools and production verification: bounded research, supported deterministic calculations, validated visuals, shared quotas, metrics, backups, failure and concurrency tests.

## Contracts

Each event needs an ID, lesson ID, sequence, schema version, lesson revision, event type and validated payload. Supported types initially: speech, board point, question, feedback and completion. Unsupported visual actions must have an explicit text fallback.

Each question needs a stable ID, assessment rubric, expected concepts and current status. Resume requests carry question ID, expected lesson revision and idempotency key. Waiting must not hold an HTTP request or worker open.

## Ownership and reuse

Django owns lessons, user answers, progress and notes. FastAPI transports events and invokes the shared teaching service; it must not duplicate business rules. PostgreSQL stores durable records and workflow checkpoints; Redis holds cache, queue and shared rate limits. Private storage holds figures and later audio.

Reuse versioned saved lesson explanations for playback and notes. Generate new explanations and open-ended feedback only when needed, within configurable budgets. DOCX continues to use saved content without inference. Do not treat schema validation or an LLM confidence value as factual verification.

## Acceptance checks

- No complete board dump before narration; no silent skipping after speech failure.
- Interruption cancels old audio and prevents obsolete callbacks/events from advancing the lesson.
- Refresh restores the pending question; duplicate answers cannot advance twice.
- Another account cannot read or resume the lesson.
- Tested misconceptions receive targeted feedback; one correct answer does not establish mastery.
- Measured first-text/audio latency, provider failures, cost and concurrent-session performance meet agreed targets.

## Decisions still required

Production TTS/STT and language coverage, reviewed curriculum/test bank, retention periods, latency targets and concurrent-session targets. Development can proceed with existing browser speech and the current LLM adapter while these are chosen. Browser sound, Word rendering and real-student learning outcomes require manual validation.


## Current implementation boundary

The final chunk can carry an explicit question and expected concepts. Playback pauses after that check. Signed-in student answers are persisted through POST /api/notes/{note_id}/answers/ with account authorization and per-note request deduplication. Feedback uses the existing answer pipeline; no mastery score is assigned. Migration classroom 0005 adds answer attempts.

Pending questions now have account-owned database progress records, optimistic revisions, and browser recovery using an account-scoped active-note pointer. Answer submission clears the saved waiting state. This restores a waiting question, not full playback or a workflow checkpoint. PostgreSQL LangGraph checkpoints, shared playback ownership, structured evaluation, event replay, SSE delivery, and production concurrency checks remain to implement. A client retry currently creates a new answer request ID; identical transport retries with the same ID are deduplicated, but cross-refresh submission deduplication requires a durable command ID.


## Playback and assessment update

Playback is owned by one provider; all classroom controls share its run and cancellation callbacks. Student submissions stop current narration. Assessments are now a separate bounded endpoint with expected-concept input, validated outcome/next-action pairing, saved feedback, lease admission, and cached repeat responses. Provider failure preserves the answer for retry. The frontend reuses a request ID for identical same-mount retries.

Still outstanding: durable LangGraph checkpoints, complete lecture restoration, event sequence/replay and live delivery, cross-refresh command IDs, automatic next-action routing and production/browser verification. The structured assessment result is an LLM judgment, not independently established correctness or mastery.
