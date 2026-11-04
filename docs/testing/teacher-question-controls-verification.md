# Teacher-question controls — 4 November 2026

Removed the standalone CC toggle row and status/guidance line above the existing classroom toolbar. Deleted the unused playback-row components, hooks, props and exports. No replacement section was added. Existing in-lesson captions retain their close action.

The existing Chat trigger, microphone and answer input now share one teacher-question access rule. They enable only for a persisted pending teacher question, while the class is active, narration has stopped and an answer is not being evaluated. Submitting an answer closes access while feedback is prepared. Correct answers resume teaching and keep the controls closed; retry/clarification feedback reopens the same question. Completed lessons without a pending teacher question leave the channels closed. Initial topic typing remains available in an empty self-study classroom, so students can still start a lesson; this does not open Chat or microphone recording.

The chat drawer is scoped to its teacher question and disappears when access closes. Closed chat handlers reject sends. The microphone requires a student click/browser permission; opening a question never starts recording automatically. Closing/changing the question detaches recognition callbacks and stops recognition. Delayed results from an old recognition instance are ignored. Teacher question changes clear the previous question input.

## Verification

- Frontend behavior/regression tests: **165 passed**.
- TypeScript and production build: passed.
- ESLint: zero errors; 15 existing warnings.
- Whitespace validation and obsolete-reference scan: passed.
- Chromium against the production build and isolated authenticated Django API/database: **16 checks passed**, with no uncaught page exceptions.

Browser assertions verify absent CC/status controls, disabled Chat/Mic before teaching questions, enabled controls at a teacher question, no automatic microphone activation, explicit Mic activation, automatic chat closing and recognition stopping after answer submission, and rejection of a late transcript. The prior automatic-start/end and completed-lesson recovery checks also pass.

Evidence: [results](artifacts/automatic-classroom-results.json), [updated toolbar screenshot](artifacts/automatic-classroom.png). Reproduce using the automatic-classroom harness described in [the lifecycle report](automatic-classroom-verification.md).

AI feedback, speech synthesis and recognition were controlled substitutes. Actual speaker output, physical microphone permission behavior, live model quality and production concurrency were not tested. Existing classroom-chat message persistence was not redesigned in this change.
