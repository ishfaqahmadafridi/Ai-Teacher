# Raised hand at the next concept question period

Verified 5 November 2026.

Raise Hand saves an account-owned request for the active lecture. Lower Hand cancels it. During narration, the teacher continues teaching and the question input and microphone remain closed. At the next concept discussion invitation, the teacher uses the authenticated account's first name (full name or username when unavailable), lowers the hand, and speaks a personal invitation before opening the existing timed question period. The microphone still requires a student click. Ordinary graded checks retain their existing behavior. Raising a hand after a question period has opened queues it for the next concept invitation.

The authenticated GET/PUT `/api/notes/<note_id>/hand/` endpoint persists `LessonProgress.hand_raised`. Hand mutations preserve the playback cursor, revision and discussion timestamp, so they cannot extend the question deadline. Migration `0012_lessonprogress_hand_raised` must be applied before running the updated backend.

Validation: 192 classroom backend tests; 169 frontend regression tests; TypeScript and production build pass. Lint has zero errors and 15 existing warnings. Browser verification uses an isolated authenticated API/database, seeded lessons, deterministic AI replies and simulated speech; physical microphone capture and live AI quality are outside this test.
