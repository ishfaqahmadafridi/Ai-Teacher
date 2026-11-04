# Classroom code quality review — 4 November 2026

## Scope and conclusion

Reviewed classroom response contracts, API consumption, lesson recovery storage, wave animation handling and the isolated browser test harness. Checked the classroom constants/defaults and recent visual/provider changes for the issues described below. This is a focused engineering review, not certification that every repository file or requirement is defect-free.

## Fixed findings

- **Duplicate and inconsistent contracts:** diagram, chunk, phase, teaching response and classroom answer TypeScript types now derive from their runtime Zod schemas. The full diagram schema is reused by classroom chunks. Diagram types and teacher positions each have one schema definition. Removed the redundant diagram-type assertion in the question hook.
- **Lost teaching data:** the stream schema previously omitted fields declared by its TypeScript interface. It now preserves validated formulas, understanding-check flags and topic maps.
- **Unchecked schema values:** removed the `z.any()` fields in the classroom schema, using `unknown` where the legacy stream intentionally accepts a flexible animation mapping.
- **Storage failures interrupting progress:** account-scoped active-note recovery hints now use reusable guarded storage functions and one storage-key prefix. Unavailable storage does not stop authenticated API checkpoint persistence. The backend remains the authority for ownership/progress.
- **Invalid wave geometry:** a string animation speed was asserted to be numeric and used in multiplication. The renderer now checks numeric values for finiteness and otherwise uses its existing defaults. Replaced the untyped line reference with the component's actual ref type.
- **Brittle browser harness:** removed the duplicated student profile fixture from the browser. It obtains profile preferences from the authenticated API. Test state paths, browser module/executable and frontend URL can be configured. The backend port can be configured independently, with a matching frontend API URL. Browser cleanup runs in `finally`; assertions require visible lesson content and a saved note. The synthetic token file is restricted to its owner.

## Hardcoded values assessment

No hardcoded real student profile, credential or generated answer was introduced into the production classroom flow by these changes. API responses supply actual lesson content and profiles. Empty sidebar/notes/student defaults are fallback states, not fabricated saved records.

Supported commands, visual model registries, bounded example simulations, labels, storage key namespaces and validation limits remain intentional application constants. These differ from hardcoded account records or deployment-specific secrets. The standalone test backend intentionally contains a synthetic profile and deterministic answer, isolated from the real database. Eliminating all literal values would not establish correctness or reuse.

This review does not claim a repository-wide absence of embedded configuration or secrets; no full secret-history audit was performed.

## Verification

- Frontend behavior/regression suite: **151 passed**.
- TypeScript: passed.
- ESLint: zero errors; 16 existing warnings remain elsewhere.
- Production build: passed.
- Reusable Chromium harness: passed against isolated authenticated Django HTTP endpoints; fixed AI output and direct worker dispatch, as documented in [the contract verification](classroom-contract-verification.md).
- Python/JavaScript test harness syntax checks and whitespace validation: passed.
- The prior **271 passing backend tests** remain relevant; no production backend code changed in this follow-up.

New tests exercise preserved teaching metadata, denied/unavailable browser storage, account-scoped recovery hints, server checkpoint persistence despite storage denial, and finite wave geometry when animation speeds are text.

The isolated browser harness now stores its database and auth file in the operating system temporary directory under `ai-teacher-e2e/`. Override that directory with `CLASSROOM_E2E_STATE_DIR` in both test processes. Override `CLASSROOM_E2E_FRONTEND_URL` in both processes if needed; `CLASSROOM_E2E_API_PORT` affects the backend, and `NEXT_PUBLIC_API_URL` must match in the frontend.

## Remaining limits

Existing lint warnings and the Next.js middleware deprecation remain. Runtime provider failures, scientific/teaching quality across arbitrary generated lessons, production broker delivery, cross-browser audio and 1,000 simultaneous-user performance are not established by this review. The existing bounded admission test and capacity limits are unchanged. A passing typecheck and test suite reduce regression risk; they cannot guarantee future changes never break behavior.
