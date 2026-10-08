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
