"""
Base Django settings shared across all environments.
"""
import os
import sys
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent.parent
# Shared backend services are importable for all Django entry points.
if str(BASE_DIR.parent) not in sys.path:
    sys.path.insert(0, str(BASE_DIR.parent))
load_dotenv(BASE_DIR.parent / '.env')
load_dotenv(BASE_DIR / '.env')

SECRET_KEY = os.environ.get(
    'DJANGO_SECRET_KEY',
    'django-insecure-local-dev-only-replace-in-production'
)

# Validate SECRET_KEY in production mode
if not os.environ.get('DJANGO_SECRET_KEY') and 'test' not in sys.argv and not os.environ.get('DJANGO_DEBUG', 'True').lower() in ('true', '1', 'yes'):
    raise RuntimeError(
        "DJANGO_SECRET_KEY environment variable MUST be explicitly set in production environments."
    )

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party
    'rest_framework',
    'corsheaders',
    'drf_spectacular',
    'rest_framework_simplejwt.token_blacklist',

    # Local apps
    'apps.users',
    'apps.dashboard.apps.DashboardConfig',
    'apps.classroom.apps.ClassroomConfig',
]

AUTH_USER_MODEL = 'users.User'

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'
WSGI_APPLICATION = 'config.wsgi.application'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
# Private note assets are served through authenticated APIs, never a public media route.
MEDIA_ROOT = Path(os.getenv('CLASSROOM_MEDIA_ROOT', str(BASE_DIR / 'private-media')))
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

# ── OpenAPI / Swagger Docs (drf-spectacular) ───────────────────────────────────
SPECTACULAR_SETTINGS = {
    'TITLE': 'AI Teacher API',
    'DESCRIPTION': (
        'AI Teacher is an enterprise academic platform powered by Gemini 2.5 Flash, '
        'RAG (ChromaDB), and a feature-based Django REST API. '
        'This document covers all Dashboard, Classroom, and Auth endpoints.'
    ),
    'VERSION': '1.0.0',
    'CONTACT': {'name': 'AI Teacher Engineering', 'email': 'engineering@ai-teacher.io'},
    'LICENSE': {'name': 'Proprietary'},
    'SERVE_INCLUDE_SCHEMA': False,
    'COMPONENT_SPLIT_REQUEST': True,
    'SORT_OPERATIONS': False,
    'TAGS': [
        {'name': 'auth', 'description': 'User authentication, registration, and token management'},
        {'name': 'dashboard', 'description': 'Dashboard global search, course progress, and metrics'},
        {'name': 'classroom', 'description': 'AI classroom tutor: ask questions, manage sessions, health'},
    ],
}

MODEL_PATH = BASE_DIR / 'model'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} — {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'apps.dashboard': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'apps.classroom': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'apps.users': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}

# Real token authentication, refresh rotation, and revocation on logout.
SIMPLE_JWT = {
    "TOKEN_REFRESH_SERIALIZER": "apps.users.serializers.auth_serializers.RegisteredTokenRefreshSerializer",
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}
GOOGLE_OAUTH_CLIENT_ID = os.getenv("GOOGLE_OAUTH_CLIENT_ID", "")

# Background timetable jobs; database records are the authoritative job results.
CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://127.0.0.1:6379/0")
CELERY_TASK_IGNORE_RESULT = True
CELERY_WORKER_PREFETCH_MULTIPLIER = 1
CELERY_TASK_SOFT_TIME_LIMIT = 120
CELERY_TASK_TIME_LIMIT = 150
TIMETABLE_MODEL = os.getenv("TIMETABLE_MODEL", "gemini-2.5-flash-lite")

TIMETABLE_REQUEST_RATE = os.getenv("TIMETABLE_REQUEST_RATE", "3/min")
TIMETABLE_WORKER_RATE = os.getenv("TIMETABLE_WORKER_RATE", "10/m")

# Fail promptly when the broker is down; report failure through the job record.
CELERY_BROKER_CONNECTION_TIMEOUT = 3
CELERY_BROKER_TRANSPORT_OPTIONS = {"socket_connect_timeout": 3, "socket_timeout": 3}
CELERY_TASK_PUBLISH_RETRY_POLICY = {"max_retries": 1, "interval_start": 0, "interval_step": 0, "interval_max": 0}

# Includes queue wait time and provider execution.
TIMETABLE_JOB_TIMEOUT_SECONDS = int(os.getenv("TIMETABLE_JOB_TIMEOUT_SECONDS", "300"))


# Run Celery beat alongside workers; attendance never depends on a dashboard visit.
CELERY_BEAT_SCHEDULE = {
    "finalize-session-attendance": {
        "task": "apps.dashboard.tasks.reconcile_attendance",
        "schedule": float(os.getenv("ATTENDANCE_RECONCILE_SECONDS", "30")),
    },
}

ATTENDANCE_HISTORY_PAGE_SIZE = int(os.getenv("ATTENDANCE_HISTORY_PAGE_SIZE", "100"))

TIMETABLE_GLOBAL_REQUESTS_PER_MINUTE = int(os.getenv("TIMETABLE_GLOBAL_REQUESTS_PER_MINUTE", "0"))
TIMETABLE_MAX_ATTEMPTS = int(os.getenv("TIMETABLE_MAX_ATTEMPTS", "3"))
TIMETABLE_DISPATCH_SECONDS = float(os.getenv("TIMETABLE_DISPATCH_SECONDS", "15"))
CELERY_BEAT_SCHEDULE["recover-timetable-jobs"] = {
    "task": "apps.dashboard.tasks.dispatch_timetable_jobs",
    "schedule": TIMETABLE_DISPATCH_SECONDS,
}

TIMETABLE_RETRY_BASE_SECONDS = float(os.getenv("TIMETABLE_RETRY_BASE_SECONDS", "15"))

# Keep attendance and recovery responsive during long LLM queues.
CELERY_TASK_ROUTES = {
    "apps.dashboard.tasks.generate_timetable": {"queue": "planning"},
    "apps.dashboard.tasks.reconcile_attendance": {"queue": "maintenance"},
    "apps.dashboard.tasks.dispatch_timetable_jobs": {"queue": "maintenance"},
}

# Lesson preparation admission is independent from API worker concurrency.
CLASSROOM_MAX_PENDING_JOBS = int(os.getenv('CLASSROOM_MAX_PENDING_JOBS', '200'))
CLASSROOM_USER_PENDING_JOBS = int(os.getenv('CLASSROOM_USER_PENDING_JOBS', '2'))
CLASSROOM_MAX_RUNNING_JOBS = int(os.getenv('CLASSROOM_MAX_RUNNING_JOBS', '2'))
CLASSROOM_REQUESTS_PER_MINUTE = int(os.getenv('CLASSROOM_REQUESTS_PER_MINUTE', '10'))
CLASSROOM_SUBMISSION_RATE = os.getenv('CLASSROOM_SUBMISSION_RATE', '6/min')
CLASSROOM_JOB_TIMEOUT_SECONDS = int(os.getenv('CLASSROOM_JOB_TIMEOUT_SECONDS', '600'))
CLASSROOM_DISPATCH_BATCH = int(os.getenv('CLASSROOM_DISPATCH_BATCH', '20'))
CELERY_TASK_ROUTES['apps.classroom.tasks.prepare_lesson'] = {'queue': 'lessons'}
CELERY_TASK_ROUTES['apps.classroom.tasks.recover_lesson_jobs'] = {'queue': 'maintenance'}
CELERY_BEAT_SCHEDULE['recover-lesson-jobs'] = {'task': 'apps.classroom.tasks.recover_lesson_jobs', 'schedule': 10.0}

CLASSROOM_BREAKER_FAILURES = int(os.getenv('CLASSROOM_BREAKER_FAILURES', '3'))
CLASSROOM_BREAKER_SECONDS = int(os.getenv('CLASSROOM_BREAKER_SECONDS', '30'))
CLASSROOM_REQUIRE_QUEUE = False

CLASSROOM_JOB_MAX_ATTEMPTS = int(os.getenv('CLASSROOM_JOB_MAX_ATTEMPTS', '3'))
CLASSROOM_RETRY_SECONDS = int(os.getenv('CLASSROOM_RETRY_SECONDS', '15'))

# Misconfigured admission must fail at startup rather than accept unbounded work.
from django.core.exceptions import ImproperlyConfigured
for _budget_name in (
    'CLASSROOM_MAX_PENDING_JOBS', 'CLASSROOM_USER_PENDING_JOBS',
    'CLASSROOM_MAX_RUNNING_JOBS', 'CLASSROOM_REQUESTS_PER_MINUTE',
    'CLASSROOM_JOB_TIMEOUT_SECONDS', 'CLASSROOM_DISPATCH_BATCH',
    'CLASSROOM_BREAKER_FAILURES', 'CLASSROOM_BREAKER_SECONDS',
    'CLASSROOM_JOB_MAX_ATTEMPTS', 'CLASSROOM_RETRY_SECONDS',
):
    if globals()[_budget_name] <= 0:
        raise ImproperlyConfigured(f'{_budget_name} must be positive')
if CLASSROOM_MAX_RUNNING_JOBS > CLASSROOM_MAX_PENDING_JOBS:
    raise ImproperlyConfigured('Running lesson capacity must not exceed total pending capacity')

REST_FRAMEWORK.setdefault("DEFAULT_THROTTLE_RATES", {})["course_outline"] = "5/min"
