# Classroom teaching-cycle verification — 28 October 2026

The tested classroom interaction flow passes after two defects found by browser testing were fixed. This is local functional verification, not a live-AI teaching-quality or production-readiness certification.

## Automated tests

- Django unit/API suite: **249 passed** using `manage.py test apps.users apps.dashboard apps.classroom --settings=config.settings.test --noinput`.
- Frontend unit/regression suite: **127 passed** using `npm run test:regressions` after the browser fixes.
- `npm run typecheck`: passed.
- Targeted ESLint on the affected playback/recovery components, hooks and tests: passed without warnings.
- `git diff --check`: passed.

Tests cover checkpoint validation, persisted answers, correct/incorrect/unclear feedback, provider failure, cached evaluation reuse, stale feedback, preserved lesson chunks, playback continuation and refresh recovery.

## Browser end-to-end scenario

Nine checks passed in Chromium using the real Next.js UI, Django authentication, HTTP endpoints, serializers, services and a temporary SQLite database. A synthetic student and a saved six-step lesson were seeded. Browser API traffic was forwarded to the isolated Django server; application responses were not replaced with browser API fixtures. External AI feedback was deterministic and browser speech was simulated.

1. Authenticate and restore the saved lesson; play its explanation and example to the guided-practice checkpoint.
2. Verify playback does not continue beyond the unanswered question.
3. Submit an incorrect answer; verify feedback appears and the same checkpoint remains pending.
4. Reload; verify the question is visible and the remaining lesson is restored.
5. Submit an unclear answer; verify clarification is requested without advancing.
6. Submit a correct guided answer; verify the saved cursor advances to the next teaching step.
7. Use the playback control; verify the next concept plays and independent practice pauses playback.
8. Answer independent practice correctly and play the recap.
9. Verify no browser runtime exceptions were recorded.

Direct ORM inspection confirmed four persisted attempts with outcomes `misconception`, `unclear`, `understood`, `understood`; the final saved cursor is section 5 with `waiting=false`. All six original lesson chunks remain intact. Playback position does not certify mastery.

## Defects discovered and fixed

- Pending questions were restored in state but invisible after refresh, and could disappear when narration stopped. Playback now adds the question to the board; recovery restores it visibly. Regression assertions cover both cases.
- Existing playback controls were not mounted in the input bar, leaving no way to continue after correct feedback. The existing controls are now mounted and exported through their package barrel.

## Final structure review

The browser scenario was rerun after restructuring and all nine checks passed again.

- Request and session contracts remain in `ask_serializers.py`.
- Generated answers and response contracts live in `answer_serializers.py`.
- Diagram normalization and validation live in `diagram_fields.py`.
- `useLessonAnswerSubmission` owns request identity, submission, grading requests and cancellation. Its tests cover evaluation retries, failed saves and aborted requests.
- Toolbar interaction remains in `useInputBar`; API calls remain in the notes service.
- Removed the obsolete custom-language form, props and state after the searchable selector replacement. Translation tests now select the supported language code directly.
- Updated consumers and package exports; no missing migrations were detected.
- Full frontend lint has zero errors and 16 existing warnings outside the changed code. TypeScript checking and whitespace validation passed.

## Duplication and consistency audit

- Consolidated repeated lesson/curriculum validation limits in backend lesson constants.
- Replaced the manual note-language lookup with one library-backed utility shared by selector and translation logic.
- Centralized backend outcome/action pairs; frontend feedback validation now rejects inconsistent pairs too.
- Reduced the scheduled prompt to curriculum-specific instructions, referring to the main teaching policy for the shared sequence.
- Final verification passed 249 backend tests, 127 frontend tests, TypeScript, all nine browser checks and whitespace checks. Full lint still reports zero errors and 16 existing warnings.

## Evidence and limits

- [Machine-readable browser results](artifacts/teaching-cycle-results.json)
- [Classroom screenshot](artifacts/teaching-cycle.png)

The browser run uses a temporary local harness and is not installed as a CI browser job. It verifies the interaction cycle starting from a saved lesson, not live lesson generation, provider reasoning quality, actual speaker output, Redis/Celery dispatch, scheduling of future recall, PostgreSQL locking, concurrent multi-device use, or load capacity. No existing student records were used or changed. The user's existing frontend development server was reused and left running.
