# Scheduled curriculum verification — 22 October 2026

## Automated results

- Django unit/API integration tests: 243 passed.
- Frontend regression tests: 112 passed, including course labels, class-context recovery and scheduled request payloads.
- FastAPI tests: 26 app tests and 19 service tests passed.
- TypeScript checking passed.

## Browser end-to-end result

16 checks passed against the local frontend and an isolated Django HTTP server with a temporary SQLite database. Authentication, API responses, ORM persistence, timetable creation, attendance, lesson queue processing, coverage validation and lecture-note storage used the real application code. Browser API requests were forwarded to the isolated server; application responses were not mocked in the browser.

The scenario created and saved a two-month course outline, displayed its nine-week plan and four quizzes, scheduled and accepted its class times, joined an available class, checked the dynamic course label, and submitted a short lesson request linked to the scheduled class ID. Backend records confirmed the saved requirements, Primary-school level, Grade 4, attendance, and lecture-note persistence.

The first deterministic AI response intentionally omitted a required concept. The lesson remained unpublished. A valid retry included all requirements, passed the independent review contract, became ready and rendered in the classroom. The verified coverage count matched the required-item count. No browser runtime exceptions were observed.

A controlled clock exercised admission timing. External AI generation/review, research retrieval and visual-provider responses were stubbed; workers executed synchronously in the isolated test harness. The final retry was triggered by the harness, so production Celery dispatch and automatic retry timing were not exercised. No real student records were modified.

## Evidence

- [Machine-readable results](artifacts/curriculum-e2e-results.json)
- [Final classroom screenshot](artifacts/curriculum-e2e.png)

## Limits

This verifies the functional flow and rejection gates, not the factual quality or consistency of a live AI provider. It does not prove student mastery, completed assignments, production broker behavior, PostgreSQL locking, concurrency or load capacity. Separate live-provider and deployment tests are needed for those claims.
