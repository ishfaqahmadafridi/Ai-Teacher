# Frontend and backend code audit

This audit combined static searches, frontend TypeScript and repository-wide ESLint, Django tests, and FastAPI unit tests. It is not certification that every path is correct or an end-to-end load/security assessment.

## Fixed

- Frontend classroom/ask validation returned unvalidated payloads after Zod failure. Parsers now fail closed.
- Global API services duplicated feature-owned implementations and contained stale classroom health routing. They now re-export canonical services.
- VoiceLoader component mixed Redux and effects into presentation. Effects moved to a shared hook with listener cleanup.
- Static five-topic badges and Physics Mechanics welcome text did not match actual lessons. Sidebar outlines now use generated key points; welcome wording is neutral.
- A duplicate LessonTopicItem interface and an unused React import were removed. A callback dependency warning was corrected.
- FastAPI streaming and agent HTTP routes were unauthenticated. They now require signed, expiring access tokens. Session-based execution is scoped by token identity.
- WebSocket connections now require an access token in the first JSON frame before questions; missing/invalid authentication closes the connection. Authentication wait is bounded and configurable.
- Raw provider error strings are no longer returned by SSE/WebSocket endpoints.
- FastAPI default CORS is restricted to local development origins. Set explicit deployment origins through configuration.
- Database URL credentials are encoded with the standard urllib library. FastAPI accepts the Django signing-key environment variable without using an insecure key fallback.
- Existing unbounded FastAPI dependency ranges were pinned to installed versions.
- The legacy FastAPI preview planner fabricated courses, a teacher, and a classroom and reused occupied slots. Registration is now required; occupied day/slot pairs are avoided; teacher/room values are omitted unless supplied. Django's persisted timetable planner remains the production path.

## Integration changes

HTTP inference clients must send Authorization: Bearer <access token>. Browser WebSocket clients must send {"token": "<access token>"} in the first frame, then send questions. Configure the same explicit signing key as Django; unconfigured services fail closed. Preview timetable requests must include actual registered_courses. None of these changes adds a new paid service or exposes credentials.

## Remaining boundaries

Repository-wide ESLint reports remaining warnings, primarily unused component props and unoptimized image tags. Their presence is recorded, not treated as successful zero-warning validation. Existing legacy .ts tests without an active runner are not included in the Node regression total.

The adaptive teaching plan still lacks durable LangGraph checkpoints, complete lecture restoration, automatic adaptive routing and ordered event replay. The legacy FastAPI preview planner does not replace Django's full availability scheduler. Native speech fallback is synchronous, English-only local development. Browser audio and production concurrency remain unverified.

Defaults, test fixtures, teaching prompts, and static design choices are not automatically bugs. A package is appropriate when it replaces standard functionality, not simply because a constant exists.
