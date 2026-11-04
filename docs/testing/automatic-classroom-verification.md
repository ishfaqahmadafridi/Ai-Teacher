# Automatic classroom lifecycle — 4 November 2026

Students no longer receive Play, Pause, Resume or Stop lecture buttons. The separate CC/status strip was removed in the subsequent teacher-interaction update; captions inside the lesson retain their existing close control. Ready self-study lessons play automatically and stop after the final step. Teacher-authored understanding checks still wait for the student's answer; accepted answers automatically advance to the next step. Incorrect or unclear answers remain available for retry. Question submissions and audio diagnostics cannot interrupt active narration or bypass a pending teacher checkpoint.

For an admitted timetable session, the classroom reads the occurrence's start/end times and server time through authenticated GET on the existing session join route. This GET never marks attendance. It uses the persisted admitted occurrence, so a reload after class end cannot accidentally select next week's recurring class. Other accounts and unadmitted students cannot read the window. An existing ready lesson is restored instead of regenerated. A student joining early can prepare/restore the lesson, but narration waits until the scheduled start. If generation is not ready at start time, playback starts once it is ready; instant provider completion is not promised.

The client advances from server time using a monotonic clock, refreshes the window periodically/on focus, and stops audio/cancels its pending request before returning to the dashboard at the scheduled end. Cancelling the browser request does not cancel durable backend generation already in progress. Existing backend curriculum admission continues to reject lesson requests outside its allowed window. Timed navigation applies to real session UUIDs; ordinary live-class/course links retain the generic classroom route.

Finished lessons persist a cursor equal to the chunk count. Restoring that cursor does not restart the lesson. Initial progress reads are now read-only; updates retain revision validation and note ownership checks. Figure capture ignores the completed cursor rather than submitting an out-of-range figure index. No database migration was introduced.

## Verification

- Django users/dashboard/classroom tests: **283 passed**.
- Frontend behavior/regression tests: **165 passed**.
- TypeScript and production build: passed.
- ESLint: zero errors, 15 existing warnings.
- Whitespace validation: passed.
- Chromium against the built frontend and isolated Django HTTP/database: **16 lifecycle/interaction checks passed**. Evidence: [results](artifacts/automatic-classroom-results.json), [screenshot](artifacts/automatic-classroom.png).

The browser scenario checks silent early arrival, automatic start, absence of manual controls, teacher-question waiting, automatic continuation, persisted completion, reload without replay, automatic dashboard return, interruption of ongoing narration at end time and rejection of a stale speech callback. No uncaught page exceptions were observed. An intermediate run found a duplicate restoration startup race and an SQLite read-to-write conflict; startup now waits for the mirrored lifecycle phase, and progress GETs no longer create rows.

The test uses synthetic admitted occurrences and saved lessons, deterministic feedback and simulated browser speech. It does not verify real speaker output, live AI quality, provider latency, Redis/Celery dispatch or load capacity. Browsers may require an initial user gesture to allow audio; the guarded audio-recovery buttons remain for that case. The app cannot prevent students from muting their device, closing the tab or leaving the class. Background/suspended tabs remain subject to browser timer and media behavior.

## Reproduction

Run the backend and frontend tests with the commands in the other verification reports. For the browser scenario, use the isolated API and the built frontend. The harness redirects its browser's API requests to that test API; it does not use the student's running backend. Use separate terminal processes and stop them afterward:

```sh
CLASSROOM_E2E_STATE_DIR=/tmp/ai-teacher-automatic-e2e CLASSROOM_E2E_API_PORT=8002 CLASSROOM_E2E_FRONTEND_URL=http://127.0.0.1:3002 backend/django_app/.venv/bin/python scripts/serve-classroom-test.py
(cd frontend && npm run build && ./node_modules/.bin/next start --hostname 127.0.0.1 --port 3002)
CLASSROOM_E2E_STATE_DIR=/tmp/ai-teacher-automatic-e2e CLASSROOM_E2E_API_PORT=8002 CLASSROOM_E2E_FRONTEND_URL=http://127.0.0.1:3002 node scripts/verify-automatic-classroom.cjs
```

Set `PLAYWRIGHT_MODULE` and optionally `CHROMIUM_EXECUTABLE` when using an existing Playwright/browser installation outside the default module paths. The harness seeds its short test classes by running `scripts/seed-automatic-classroom-test.py` with the project Python; override `DJANGO_PYTHON` if necessary. Credentials and SQLite state stay in the temporary state directory.

The follow-up [teacher-question controls verification](teacher-question-controls-verification.md) records the question-only Chat/Mic gate and removal of the extra strip.
