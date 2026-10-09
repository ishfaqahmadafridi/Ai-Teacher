"""Shared provider admission control across all workers (Redis server clock)."""
from django.conf import settings
from redis import Redis

_SCRIPT = """
local now = redis.call('TIME')
local seconds = tonumber(now[1])
local bucket = math.floor(seconds / 60)
local key = KEYS[1] .. ':' .. bucket
local count = tonumber(redis.call('GET', key) or '0')
if count >= tonumber(ARGV[1]) then return 60 - (seconds % 60) end
redis.call('INCR', key)
redis.call('EXPIRE', key, 120)
return 0
"""


def planning_delay():
    limit = settings.TIMETABLE_GLOBAL_REQUESTS_PER_MINUTE
    if not limit:
        return 0
    client = Redis.from_url(settings.CELERY_BROKER_URL, socket_connect_timeout=3, socket_timeout=3)
    return int(client.eval(_SCRIPT, 1, f"timetable:provider:{settings.TIMETABLE_MODEL}", limit))
