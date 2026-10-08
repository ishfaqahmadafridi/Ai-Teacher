#!/usr/bin/env bash
set -euo pipefail
project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_root/backend/django_app"
exec .venv/bin/celery -A config worker -Q maintenance --hostname="maintenance@%h" --pool=threads --concurrency="${TIMETABLE_MAINTENANCE_CONCURRENCY:-1}" --loglevel=info
