# Conceptual visual verification — 28 October 2026

The implemented contracts, rendering and provider-fallback paths pass local tests. This is functional verification, not scientific accuracy or live-provider certification.

**Follow-up:** [Real subject lecture checks](live-subject-lecture-verification.md) found physics playback failure, missing mechanical 3D, biology node overlap and unavailable images. The seeded checks below do not establish reliable live lecture delivery.

## Automated checks

- Django users/dashboard/classroom suite: **263 passed**.
- Frontend regression suite: **137 passed**.
- TypeScript checking: passed.
- Full frontend lint: zero errors, 16 existing warnings outside changed code.
- `git diff --check`: passed.

Run from the repository root:

```sh
cd backend/django_app
.venv/bin/python manage.py test apps.users apps.dashboard apps.classroom --settings=config.settings.test --noinput
```

Run frontend checks in another terminal from the repository root:

```sh
cd frontend
npm run test:regressions
npm run typecheck
npm run lint
```

Coverage includes finite bounded coordinates, duplicate graph IDs/edges, missing references, all approved builders, molecule atom counts, invalid focus, serializer round trips, optional visual failure, prompt integration, token/provider reporting, geometry validity, SVG output, arrow endpoints, WebGL2 availability and persisted visual recovery. Groq tests mock HTTP: primary success makes no fallback call; actual Gemini SDK errors wrapped by LangChain retain quota detection; non-429 errors never trigger fallback; Groq failure propagates without a retry loop.

## Browser verification

Ten checks passed in Chromium with the actual Next.js UI, Django auth/HTTP/ORM and a temporary SQLite database. A seeded eight-step lesson covered a labelled process schematic, bridge, beam, piston, pulley, water, carbon dioxide and methane. Each 3D view rendered a WebGL canvas, exposed the focused part, and changed its captured pixels after camera dragging/zooming. Checkpoints were advanced through the real answer/evaluation APIs using deterministic feedback and simulated speech.

A separate browser context disabled WebGL and restored the pending lesson from the real API. Its labelled 2D parts inventory rendered visibly, preserving the focused carbon atom. The normal browser recorded no runtime exceptions. Development-mode Three.js deprecation and software-rendering performance warnings were present; an aborted progress request on React effect cleanup was expected. The figure endpoint accepted captures with HTTP 204.

The temporary fixture retained the old “Plant roots” lesson title and generic checkpoint feedback; its deliberately mixed visuals test rendering and transport, not an AI-generated coherent lesson. No existing student records were used. The browser harness ran locally from `/tmp/ai-teacher-e2e`; it is not an installed CI browser job.

Browser testing found and fixed two integration defects: refresh restored the question without its visual, and canvas fallback markup was hidden in browsers lacking WebGL. Recovery now restores the current diagram/formula, and Three.js's capability helper selects the 2D view before mounting a failing renderer. Structured visuals also now participate in the existing note-figure capture flow.

## Evidence and limits

- [Browser results](artifacts/visual-results.json)
- [Bridge](artifacts/visual-bridge.png), [water](artifacts/visual-water.png), [schematic](artifacts/visual-schematic.png), [no-WebGL fallback](artifacts/visual-no-webgl.png)
- [Setup and supported contracts](../conceptual-lesson-visuals.md)

Dotenv key presence and runtime construction of `QuotaFallbackLLM` were verified without exposing values. Actual key validity, provider free-tier eligibility, live Gemini/Groq generation, explanation quality, medical accuracy, Redis/Celery dispatch, concurrent load and arbitrary text-to-3D generation were not tested. A 3D note capture stores the canvas image; HTML labels/legend are not baked into that canvas. The existing frontend server was left running; the isolated test backend was stopped after verification.
