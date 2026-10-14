# Classroom capacity and deployment

The lesson queue controls admission; it does not promise 1,000 immediate AI generations.

## Implemented flow

Authenticated POST /api/lesson-jobs/ returns a durable job in PostgreSQL (SQLite only locally). GET /api/lesson-jobs/<id>/ returns that account's result. The frontend polls with jitter and an abortable wait and shows queued/preparing states. A dedicated Celery lessons queue performs generation, then saves notes and history in a fenced transaction. Retries of the same request ID reuse the result. Identical pending requests within an account/context join one job. Private conversations are never shared between accounts.

Admission defaults: 200 total pending jobs, 2 per account, 2 active generations, 10 generation starts/minute. Configure these from measured provider quota and resources. Overload returns 429. Redis quota failures defer work, not uncontrolled provider calls. Three failures open a 30-second circuit breaker. Celery late acknowledgement, prefetch=1 and periodic outbox recovery protect delivery; worker tokens prevent stale completion writes. Transient generation failures retry up to 3 attempts with exponential delays. Stalled workers are fenced and recovered within that attempt limit; pending jobs expire. Ordinary notes downloads and ready-job polling use no LLM calls.

## Local startup

Migrations must run before the API/worker. Docker Compose includes a dedicated lesson_worker and Redis-backed cache. Use `docker compose -f infra/docker-compose.yml up --build`.

For native macOS development, start Redis, run migrations, then start `celery -A config worker -Q lessons --pool=solo --concurrency=1 --loglevel=info`. Use prefork on Linux/Docker for hard task time limits. The native solo pool cannot enforce Celery hard time limits, so provider request timeouts and database fencing still matter. in backend/django_app. Run one existing Celery beat and the maintenance worker so the recovery task executes. Restart previously running beat after updating its configuration. Do not run duplicate beat schedulers.

## Production deployment

Use production settings with PostgreSQL, shared Redis and a load balancer. The legacy blocking /api/ask/ is disabled in production. Serve the short API with Gunicorn, for example `gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 4 --threads 4 --timeout 30`. Pool/sizing depends on measured database capacity; configure PgBouncer separately if needed. Never run the development server in production.

Serve public reviewed visual assets through a CDN. Private student figures/audio/documents require authenticated authorization or short-lived signed URLs; never publish private media as public CDN objects. Object storage/CDN and autoscaling need the chosen hosting account and deployment configuration. They are not provisioned by the application changes. Autoscale API replicas independently from lesson workers, and retain the global provider limits; worker scaling does not create API quota. Use platform queue-depth scaling when configured, with CPU/memory limits and a cap aligned with CLASSROOM_MAX_RUNNING_JOBS.

Staff-only /api/lesson-jobs/metrics/ reports counts, oldest wait and breaker state. Structured worker logs include queue wait, elapsed time and token counts. Collect p95/error/cache-hit metrics at the load balancer/observability platform. FastAPI streaming and other LLM operations require their own shared budget; the lesson admission budget is not a universal provider-token limiter.

## Reproducible load tests

Install k6, provision staging test accounts and seed their prepared notes. Export BASE_URL and comma-separated TEST_TOKENS securely. Run `k6 run infra/load-tests/classroom.js` for 1,000 viewers; use WORKLOAD=submissions or mixed plus ALLOW_AI_LOAD=true only with an approved provider budget. A token per simulated student is needed for representative account load; reusing a token measures that account's limits instead. Record accepted/rejected submissions, queue wait, completion throughput, p95 latency, errors, bandwidth and database/worker utilization. Expected 429s prove backpressure, not adequate generation capacity.

These scripts are not a successful capacity certification. Real 1,000-user staging tests, CDN/object storage provisioning and platform autoscaling remain deployment work. Local correctness tests cannot establish production throughput. Prepared lesson reuse across accounts needs a separate reviewed, non-personal curriculum artifact; private answer histories are deliberately excluded from shared caching.

## Deployment template
`infra/docker-compose.production.yml` provides the API worker server, dedicated queues, one beat and an internal Nginx gateway. Set a versioned BACKEND_IMAGE, pinned NGINX_IMAGE digest, PRODUCTION_ENV_FILE, external PostgreSQL/Redis credentials and trusted TLS ingress. Run migrations once before starting replicas. The production build installs the pinned production database/cache/server dependencies. The health check uses the configured allowed host and trusted-proxy HTTPS header; the template is not deployed or Docker-runtime-validated in this environment (Docker is unavailable). Compose is a fixed-host baseline, not an autoscaler. Platform autoscaling and a CDN require hosting-specific provisioning and measurements.

Pending job IDs are stored in the account's conversation session and recovered on classroom reload. Storage denial does not interrupt generation. Backend ownership checks remain authoritative.

## Local verification on 2026-10-13
- A real authenticated request passed through Django → Redis/Celery → Gemini → saved notes. A completed request was replayed in Chromium without another generation; the heart image loaded with no page errors. Speech was stubbed for the visual test.
- A real provider high-demand response was handled as a failed job in the first implementation; bounded retry and circuit-breaker tests cover the updated recovery path.
- Real Redis rolling admission passed. DOCX export contained four captured figures.
- The 1,000-student admission correctness test accepted 200 and rejected 800 with HTTP 429 at the configured cap, making no provider calls. This is sequential API correctness testing, not a simultaneous-user load benchmark.
- Docker and k6 are unavailable here. Docker files were YAML-parsed; production runtime, CDN/object storage, autoscaling and concurrent staging load are not verified.
