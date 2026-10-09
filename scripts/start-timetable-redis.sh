#!/usr/bin/env bash
set -euo pipefail
project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
redis_binary="${REDIS_SERVER_BINARY:-$project_root/.runtime/bin/redis-server}"
if [[ ! -x "$redis_binary" ]]; then
  redis_binary="$(command -v redis-server || true)"
fi
if [[ -z "$redis_binary" ]]; then
  echo 'Redis is not installed. Install it using Homebrew or use infra/timetable-queue.yml.' >&2
  exit 1
fi
mkdir -p "$project_root/.runtime/redis"
exec "$redis_binary" --bind 127.0.0.1 --protected-mode yes --port "${TIMETABLE_REDIS_PORT:-6379}" --appendonly yes --dir "$project_root/.runtime/redis"
