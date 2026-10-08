# Timetable planning

Django owns course records, timetable jobs and accepted schedules. Celery runs the existing Gemini integration and a deterministic scheduling service. FastAPI is not duplicated for this workflow. The AI proposes a one-week topic outline using registered course IDs; it does not receive student identity. The backend validates the plan's course coverage and places fixed-duration sessions within the student's availability. Course credits are not treated as study-hour requirements.

## Run locally

From `backend/django_app`, install the updated requirements and run migrations:

```sh
.venv/bin/python -m pip install -r requirements/base.txt
.venv/bin/python manage.py migrate
```

Start Redis on macOS:

```sh
brew install redis
brew services start redis
```

Alternatively, start Redis using the supplied queue-only Compose file:

```sh
docker compose -f infra/timetable-queue.yml up -d
```

From the repository root, start the worker in a separate terminal:

```sh
./scripts/start-timetable-worker.sh
```

Run Django and the frontend using their existing development commands. Set `GEMINI_API_KEY` or `GOOGLE_API_KEY` in the backend environment. Optional settings: `TIMETABLE_MODEL`, `CELERY_BROKER_URL`, `TIMETABLE_REQUEST_RATE`, and `TIMETABLE_WORKER_RATE`. Do not expose provider credentials in frontend variables.

## API

- POST `/api/dashboard/timetable/generate/`: validates availability and registered courses; returns HTTP 202 with a job ID. Identical requests reuse their job; each account has at most one pending request.
- GET `/api/dashboard/timetable/jobs/{id}/`: authenticated owner-only progress/result.
- POST `/api/dashboard/timetable/jobs/{id}/`: accepts the validated proposal and saves the schedule.
- GET `/api/dashboard/timetable/`: loads the signed-in user's saved schedule.
- POST `/api/dashboard/timetable/`: adds a manual slot for a registered course; rejects overlaps.

Failed provider or broker requests are visible, and no fake result is generated. Requests older than five minutes can be retried. Completed proposals are reused for identical inputs. Customization reopens preferences and generates a new validated proposal rather than silently editing times in the browser.

## Deployment boundaries

Use PostgreSQL for production, a durable Redis deployment and monitored workers. Worker rate limits apply per worker, not globally: tune aggregate concurrency to the provider quota. Free API quotas do not guarantee production capacity. This release does not claim a 1,000-user load test or adaptive replanning based on activity. A transactional outbox and recovery monitor are follow-up requirements for guaranteed dispatch across process crashes. No automatic provider retry loop is enabled, avoiding unbounded cost on invalid requests.

`TIMETABLE_JOB_TIMEOUT_SECONDS` controls when queued or processing jobs expire
(default: 300 seconds). Set this above expected queue wait plus generation time.
Timetable preferences require whole-minute local times; timezone validation uses
Python's `zoneinfo` database. Acceptance and manual additions both lock the user
record to serialize writes to the saved timetable.

## Session access and attendance

`POST /api/dashboard/timetable/sessions/<session-id>/join/` checks ownership and
server time in the session timezone before recording a join. The allowed interval
includes the start and excludes the end. Repeated joins are idempotent per student,
session UUID, and local session date. Attendance means a successful join, not full
class completion or a duration measurement.

Saved timetable reads are read-only. Celery beat runs attendance reconciliation every
`ATTENDANCE_RECONCILE_SECONDS` (default 30 seconds). It backfills elapsed weeks from
the tracking activation date, uses a persisted cursor and indexed next-due time,
and never overwrites attended
records. Dated `SessionOccurrence` snapshots preserve titles, subjects, timestamps,
and timezone after replacement. No records are invented before activation.
Run exactly one beat scheduler per deployment: `./scripts/start-timetable-beat.sh`.
Run Redis and planning workers using the existing startup scripts. Run the
maintenance worker with `./scripts/start-timetable-maintenance.sh`; its separate
queue keeps attendance and job recovery independent of long LLM job backlogs.

`GET /api/dashboard/attendance/` returns a bounded history page, recent missed
classes and database aggregate totals. Only ended occurrences count. Empty history
has a null rate. `GET /api/dashboard/attendance/export/` streams the full CSV and
escapes spreadsheet formula cells. Both endpoints scope records to the signed-in user.

The UI selects today in the timetable timezone, allows manual day selection, and
resets that selection after midnight. A shared clock drives the five-minute reminder
and end-time cache refresh. These reminders require the schedule to be open; no
browser push notification is sent. Times display AM/PM while saved values stay in
24-hour form.

Country timezone defaults come from the installed IANA `tzdata` package. Countries
with exactly one timezone suggest that timezone when country is saved without an
explicit timezone. Explicit selections and historical session timezones are preserved.
Timetable reads never change profile or schedule data.


## Durable jobs and production limits

Queued database jobs are the durable dispatch source. Beat republishes unclaimed
jobs after broker outages, and duplicate deliveries are guarded by row locks.
Every processing attempt has a run token; stale workers cannot overwrite later
attempts. Transient network/provider failures retry with bounded exponential delay
and jitter; validation failures fail immediately. Expired processing jobs become
failed, allowing an explicit user retry. Planner SDK retries are disabled so the
worker owns retry policy and admission accounting.

Production enables a Redis-wide admission limit using Redis server time:
`TIMETABLE_GLOBAL_REQUESTS_PER_MINUTE` defaults to 10; configure it for the actual
provider/project quota. Development disables this gate unless explicitly configured.
`TIMETABLE_MAX_ATTEMPTS`, `TIMETABLE_RETRY_BASE_SECONDS` and
`TIMETABLE_DISPATCH_SECONDS` configure recovery behavior. Redis admission failures
leave jobs queued instead of bypassing the quota.

Attendance, scheduling and reporting use no LLM tokens. Generating new lesson topics
still uses the configured LLM; existing identical per-user requests reuse saved results.
Cross-user curriculum reuse needs explicit syllabus/version ownership rules and is
not enabled by this change. Attendance measures a valid join, not time spent in class.

Before production launch, run PostgreSQL concurrency/load tests, supervise Redis,
workers and beat, monitor queue age and provider errors, and verify database backup
restoration. Local SQLite tests do not demonstrate capacity for thousands of users.

Local SQLite uses IMMEDIATE transactions and a configurable busy timeout to avoid
read-to-write lock upgrades. This supports development; production still requires
PostgreSQL concurrency testing. Maintenance defaults to one worker thread locally.
