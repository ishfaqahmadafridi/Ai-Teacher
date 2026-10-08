#!/usr/bin/env bash
set -euo pipefail
project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_root/backend/django_app"
if [[ ! -x .venv/bin/celery ]]; then
  echo 'Install backend dependencies before starting the timetable worker.' >&2
  exit 1
fi
.venv/bin/python - <<'PY'
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.local')
import django
django.setup()
from django.conf import settings
from redis import Redis
try:
    Redis.from_url(settings.CELERY_BROKER_URL, socket_connect_timeout=3).ping()
except Exception:
    raise SystemExit('Redis is unavailable. Start Redis first (macOS: brew services start redis).')
print('Redis is ready. Starting the timetable worker.')
PY
exec .venv/bin/celery -A config worker --hostname="planning@%h" -Q planning --pool=threads --concurrency="${TIMETABLE_WORKER_CONCURRENCY:-2}" --loglevel=info
