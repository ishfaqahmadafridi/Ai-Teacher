# Classroom contract verification — 4 November 2026

The invalid diagram-action failure shown in the reported screenshot has a defensive frontend fix. TypeScript and both diagram validators now share the supported action list. Missing, null, wrongly typed and unsupported actions become `none`, preserving validated narration. Malformed lesson bodies still fail validation. Schema failures during question submission and lesson recovery produce a short retry message instead of raw Zod issue JSON. `DiagramCommand` also declares the validated fallback visual field.

Existing uncommitted visual/provider changes were preserved and included in verification; this report does not attribute those changes to this fix.

## Executed checks

| Check | Result |
| --- | --- |
| Django users, dashboard and classroom tests | 271 passed using `config.settings.test` |
| Frontend regression/unit behavior suite | 145 passed, including four new contract tests |
| TypeScript | Passed |
| ESLint | Zero errors; 16 existing warnings |
| Production Next.js build | Passed outside the restricted sandbox |
| Real Chromium with isolated Django HTTP backend | Passed; ready job, saved note, rendered classroom, no uncaught page exceptions |
| Whitespace validation | Passed |

The first backend run with development settings failed three assertions because shared throttling returned 429. The isolated settings run passed. Use the test settings command below for reproducible tests rather than a development Redis cache. The sandbox production build stalled; it was stopped, then the unrestricted build passed.

The browser scenario deliberately returns an unsupported action at the provider boundary. The real frontend accepts this using its safe fallback. Authentication/profile verification, HTTP submission/polling, database job persistence, worker logic and note saving are real. AI generation is a deterministic fixture, Redis quota admission is replaced, and Celery dispatch directly invokes the worker. This test does **not** verify live AI generation, broker delivery, spoken audio quality or production concurrency. Only a synthetic account and isolated temporary SQLite database were used. Test servers were stopped afterward.

Evidence: [browser results](artifacts/classroom-contract-e2e-results.json), [classroom screenshot](artifacts/classroom-contract-e2e.png).

## Reproduction

From the repository root:

```sh
(cd backend/django_app && .venv/bin/python manage.py test apps.users apps.dashboard apps.classroom --settings=config.settings.test --noinput)
(cd frontend && npm run test:regressions)
(cd frontend && npm run typecheck)
(cd frontend && npm run lint)
(cd frontend && npm run build)
```

For the browser scenario, start each server in a separate terminal. Ports 8000 and 3001 must be free; the frontend API URL must target `http://127.0.0.1:8000`.

```sh
backend/django_app/.venv/bin/python scripts/serve-classroom-test.py
(cd frontend && npm run dev -- --hostname 127.0.0.1)
node scripts/verify-classroom-browser.cjs
```

The browser harness needs an installed Playwright package and Chromium. Set `PLAYWRIGHT_MODULE` to the module path and optionally `CHROMIUM_EXECUTABLE` to the browser executable if they are not on the default module/browser paths. No new dependency was installed. Stop the two servers after running the scenario. Do not use the test server for production.

## Teaching behavior and capacity assessment

The passing suites cover answer evaluation/retries, waiting for an understanding check, lesson progress/recovery, scheduled curriculum and note/export behavior. They establish tested mechanics, not teaching excellence, scientific accuracy for every generated lesson or quality across every language. This browser scenario checks one circuit lesson and does not establish all subjects or teacher presentation styles.

The existing 1,000-account admission test passed: **200 accepted, 800 controlled 429 responses**, with zero AI provider calls. It submits sequentially and is not a simultaneous load benchmark. The repository defaults allow 200 pending jobs, 2 active generations and 10 provider starts per minute. The application therefore cannot currently be certified for 1,000 simultaneous live lesson generations.

The existing k6 script is available at `infra/load-tests/classroom.js`, but k6 and Docker are not installed in this environment. No staging URL, 1,000 staging account tokens or production database/worker measurements were supplied. The real 1,000-user load test remains unperformed. The existing [capacity document](../classroom-capacity.md) describes production prerequisites and the staging workload. Production latency, throughput, database locking under PostgreSQL load and autoscaling remain unverified.

Follow-up: [classroom code quality review](classroom-code-quality-review.md) records the schema-derived types, storage resilience, wave safety fix and updated test harness configuration.
