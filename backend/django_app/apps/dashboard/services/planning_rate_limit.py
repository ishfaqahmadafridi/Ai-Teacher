"""Shared provider admission control across all workers (Redis server clock)."""
from django.conf import settings
from redis import Redis

from shared.redis_admission import PROVIDER_ADMISSION_SCRIPT as _SCRIPT


def planning_delay():
    limit = settings.TIMETABLE_GLOBAL_REQUESTS_PER_MINUTE
    if not limit:
        return 0
    client = Redis.from_url(settings.CELERY_BROKER_URL, socket_connect_timeout=3, socket_timeout=3)
    return int(client.eval(_SCRIPT, 1, f"timetable:provider:{settings.TIMETABLE_MODEL}", limit))
