# Timed concept Q&A — 5 November 2026

Newly generated lessons can include a `discussion_prompt` chunk: the teacher speaks an invitation to ask questions about the concept just explained. After narration ends, typing, Chat and Mic become available for a 30-second question period. The microphone still requires a student click and browser permission. No extra toolbar/status section or countdown section was added.

This is separate from graded understanding checks. A Q&A invitation cannot carry question/rubric fields. Student silence advances to the next concept without creating a correct answer, score or mastery record. Existing graded checks retain their assessment behavior. Older saved lectures retain their original content; generate a new lecture to receive the explicit invitations.

## Behavior and persistence

- The server sets the Q&A deadline from the existing persisted progress timestamp. Repeated open requests and reloads reuse that deadline instead of starting another 30 seconds. The default is `CLASSROOM_DISCUSSION_SECONDS=30`, bounded to 1–120 seconds.
- The student question and teacher reply are saved as an owned, idempotent lesson attempt. The saved lesson chunks are never replaced by a discussion reply. A retry reuses a cached reply; changed text cannot reuse the same request ID. Leases and shared provider admission prevent duplicate concurrent reply work and uncontrolled provider starts.
- A dedicated, validated reply prompt answers questions about the current concept and redirects unrelated questions. Reference/student text stays in the human message. Replies use the lesson language and student context; no grade is awarded.
- Typing and Mic close during reply preparation/playback. If time remains after the reply, the student can ask another question. At expiry, channels close; an already submitted reply may finish before the lecture continues. The deadline is not extended. A bounded audio timeout and request timeout prevent an indefinitely stuck reply.
- If nobody asks, the next cursor is saved and the lesson resumes automatically. Restoring an expired window immediately continues instead of reopening it. Scheduled class ending still stops playback and cancels the browser's active work.
- Failed provider replies leave the question saved and release their lease, with no fabricated answer or score. The lesson can continue when the question period expires.

No database migration is required: the implementation reuses `LessonProgress.updated_at` and the existing lesson-attempt storage. Restart API and lesson workers to load the new prompt; restart/reload the frontend and generate a new lesson. Deploy backend/frontend together for the discussion field and progress metadata.

## Verification

- Full Django users/dashboard/classroom suite: **291 passed**.
- Frontend behavior/regression suite: **169 passed**.
- TypeScript and production build: passed.
- ESLint: zero errors; 15 existing warnings.
- Whitespace check: passed.
- Chromium with isolated authenticated Django HTTP/database and the built frontend: both real-time 30-second scenarios passed.

The browser scenarios cover a silent question period with reload/deadline preservation, and a student concept question with a spoken reply and automatic continuation. They verify controls close afterward, no grading endpoint is called, saved lesson chunks remain intact and there are no uncaught page exceptions. The backend tests also cover exact deadline behavior, non-extension on retries, ownership, malformed mixed Q&A/assessment output, cached replies, expired periods, shared quota denial and provider failure.

[Browser results](artifacts/timed-discussion-results.json). AI feedback and speech are controlled fixtures; real provider quality, physical speaker/microphone behavior, Redis/Celery dispatch and production load were not verified. Browser timers and media remain subject to suspended/background-tab behavior. The 30 seconds applies to the student question period; finishing an already submitted teacher reply can delay narration of the next concept.

## Reproduction

Start `scripts/serve-classroom-test.py` with `CLASSROOM_E2E_STATE_DIR`, `CLASSROOM_E2E_API_PORT=8002` and `CLASSROOM_E2E_FRONTEND_URL=http://127.0.0.1:3002`. Serve the built frontend on port 3002, then run `scripts/verify-timed-discussion.cjs` with the same environment. Set `PLAYWRIGHT_MODULE`, optional `CHROMIUM_EXECUTABLE` and optional `DJANGO_PYTHON` for your local installations. The script seeds only its temporary database using `scripts/seed-timed-discussion-test.py`; no real account data or live provider calls are used. Stop the test processes afterward.
