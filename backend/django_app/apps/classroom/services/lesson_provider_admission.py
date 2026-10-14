"""Global Redis provider quota, shared between every lesson worker."""
from django.conf import settings
from redis import Redis

# Redis server time avoids clock skew between API/worker hosts.
from shared.redis_admission import PROVIDER_ADMISSION_SCRIPT as _SCRIPT


def provider_delay():
    client = Redis.from_url(settings.CELERY_BROKER_URL, socket_connect_timeout=3, socket_timeout=3)
    delay = client.eval(_SCRIPT, 1, 'classroom:provider:admission', settings.CLASSROOM_REQUESTS_PER_MINUTE)
    if not isinstance(delay, int) or not 0 <= delay <= 60:
        raise ValueError('Invalid provider admission response')
    return delay
