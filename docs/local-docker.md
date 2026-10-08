# Local Docker development

This setup runs the backend in Docker and keeps Next.js running on the host.
It uses the existing local SQLite database, not a new PostgreSQL database.
Use Docker Compose 2.24 or newer (optional env-file support).

## Start

1. Install and start Docker Desktop.
2. Stop host Django, FastAPI, planning/maintenance workers and Beat before switching.
   Do not run two Beat schedulers against the same queue. Stop the standalone
   `infra/timetable-queue.yml` stack if it is no longer needed.
3. Keep API credentials in the existing ignored `backend/.env` and/or
   `backend/django_app/.env`. These files are injected at runtime, not baked into
   the image. Do not print resolved Compose configuration when sharing logs:
   it can contain secrets. Missing keys allow startup but prevent AI generation.
4. Back up `backend/django_app/db.sqlite3` before the first start; the migration
   service applies pending migrations to that existing database.
5. From the repository root:

```sh
docker compose -f infra/docker-compose.yml up --build -d
docker compose -f infra/docker-compose.yml ps
docker compose -f infra/docker-compose.yml logs -f django_app planning_worker maintenance_worker beat
```

Run the frontend using its existing local development command on port 3001.
Django stays at http://localhost:8000 and FastAPI at http://localhost:8001.
Ports are bound to localhost only. Redis is accessible only inside the Compose
network. `DJANGO_PORT` and `FASTAPI_PORT` can override host ports; update frontend
API configuration if you change them.

## What runs inside Docker

| Service | Responsibility |
| --- | --- |
| migrate | Applies migrations once; must succeed before Django/workers start |
| django_app | Login, courses, timetable and attendance APIs; source auto-reload |
| fastapi_app | Classroom streaming/WebSockets; source auto-reload |
| redis | Durable background job queue using append-only storage |
| planning_worker | Processes AI timetable jobs from the planning queue |
| maintenance_worker | Finalizes attendance and recovers planning jobs |
| beat | Publishes recurring maintenance jobs; run exactly one instance |

The image definition is in `backend/docker/Dockerfile`; `backend/.dockerignore`
stays at the build-context root to exclude secrets and local artifacts.
One backend image installs both existing dependency sets. Source directories are
mounted for editing; rebuild after dependency changes. Python runs as a non-root
user. On Linux, ensure UID 1000 has write access to the mounted SQLite directory.
Worker code does not auto-reload: restart workers and Beat after Python changes.

## Where data lives

- Profiles, courses, schedules, occurrences and attendance: the existing
  `backend/django_app/db.sqlite3` on your host, shared by Django and workers.
- Redis queue: Docker named volume `queue_data`.
- Downloaded embedding models: Docker named volume `model_cache`.
- RAG files: existing files under the mounted Django source directory.
- API keys: runtime environment variables. LLM requests still call your configured
  external provider; Docker does not create a local LLM.

## Verify and stop

```sh
docker compose -f infra/docker-compose.yml exec django_app python manage.py check
docker compose -f infra/docker-compose.yml exec django_app python manage.py test apps.dashboard.tests apps.users.tests apps.classroom.tests --settings=config.settings.test --noinput
docker compose -f infra/docker-compose.yml restart planning_worker maintenance_worker beat
docker compose -f infra/docker-compose.yml down
```

`down` preserves named volumes and host database files. `down -v` removes Docker
queue/model volumes; it does not delete the host SQLite file. The migration job
must finish successfully; inspect its logs if services remain blocked.

This is a local development configuration: SQLite and thread workers retain the
current local behavior. Production deployment needs its own settings, PostgreSQL,
process supervision and concurrency/load testing. Nginx is not started in this
local stack; the frontend uses the existing direct API ports.

## Validation status

Static YAML, source mount paths, queue routing address, migration gating, Redis
health gating and whitespace checks passed. Image build and container runtime
checks remain unverified because Docker is unavailable in the development
terminal used to prepare these files.
