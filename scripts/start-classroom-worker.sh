#!/usr/bin/env bash
set -euo pipefail
project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_root/backend/django_app"
if [[ ! -x .venv/bin/celery ]]; then
  echo 'Install backend dependencies before starting the classroom worker.' >&2
  exit 1
fi
.venv/bin/python - <<'CHECK'
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.local')
import django
django.setup()
from django.conf import settings
from redis import Redis
try:
    Redis.from_url(settings.CELERY_BROKER_URL, socket_connect_timeout=3).ping()
except Exception:
    raise SystemExit('Redis is unavailable. Run bash scripts/start-timetable-redis.sh from the project root first.')
print('Redis is ready. Starting the classroom lesson worker.')
CHECK
exec .venv/bin/celery -A config worker --hostname="lessons@%h" -Q lessons --pool=threads --concurrency="${CLASSROOM_WORKER_CONCURRENCY:-1}" --loglevel=info
