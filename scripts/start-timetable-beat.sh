#!/usr/bin/env bash
set -euo pipefail
project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
mkdir -p "$project_root/.runtime"
cd "$project_root/backend/django_app"
exec .venv/bin/celery -A config beat --loglevel=info --schedule="$project_root/.runtime/celerybeat-schedule" --pidfile="$project_root/.runtime/celerybeat.pid"
