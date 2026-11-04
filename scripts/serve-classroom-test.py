"""Serve a loopback test API with isolated state and a deterministic AI fixture."""
import json
import os
from pathlib import Path
import sys
import tempfile
from unittest.mock import Mock, patch

ROOT = Path(__file__).resolve().parents[1]
STATE_DIR = Path(os.environ.get('CLASSROOM_E2E_STATE_DIR', Path(tempfile.gettempdir()) / 'ai-teacher-e2e'))
API_PORT = int(os.environ.get('CLASSROOM_E2E_API_PORT', '8000'))
FRONTEND_URL = os.environ.get('CLASSROOM_E2E_FRONTEND_URL', 'http://127.0.0.1:3001')
INJECTED_ACTION = 'unsupported_provider_action'


def main():
    sys.path.insert(0, str(ROOT / 'backend' / 'django_app'))
    os.environ['DJANGO_SETTINGS_MODULE'] = 'config.settings.test'
    STATE_DIR.mkdir(parents=True, exist_ok=True, mode=0o700)

    import django
    from django.conf import settings

    settings.DATABASES['default']['NAME'] = str(STATE_DIR / 'db.sqlite3')
    settings.ALLOWED_HOSTS = ['127.0.0.1', 'localhost']
    settings.CORS_ALLOWED_ORIGINS = [FRONTEND_URL]
    settings.CORS_ALLOW_CREDENTIALS = True
    settings.CACHES = {'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'}}
    django.setup()

    from django.contrib.auth import get_user_model
    from django.core.management import call_command
    from rest_framework_simplejwt.tokens import RefreshToken
    from apps.classroom.services import lesson_jobs
    from apps.classroom.tests.lecture_note_fixtures import lesson_answer

    call_command('migrate', verbosity=0)
    user, _ = get_user_model().objects.update_or_create(
        username='contract-e2e',
        defaults={
            'email': 'contract-e2e@example.org', 'first_name': 'Test',
            'country': 'Pakistan', 'timezone': 'Asia/Karachi',
            'preferred_language': 'en', 'education_level': 'university',
            'academic_year': '1', 'selected_interests': ['Physics'],
            'onboarding_completed': True, 'is_verified': True,
        },
    )
    auth_path = STATE_DIR / 'auth.json'
    # Restrict the test token before writing it, including on repeated runs.
    with os.fdopen(os.open(auth_path, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600), 'w') as auth_file:
        os.chmod(auth_path, 0o600)
        json.dump({
            'token': str(RefreshToken.for_user(user).access_token),
            'id': user.pk, 'injected_action': INJECTED_ACTION,
        }, auth_file)

    def generate(*args, **kwargs):
        answer = lesson_answer()
        answer['model_info'] = {}
        answer['chunks'][0]['diagram']['action'] = INJECTED_ACTION
        return answer

    from langchain_core.messages import AIMessage
    evaluator = Mock()
    evaluator.bind.return_value.invoke.return_value = AIMessage(content=json.dumps({
        'outcome': 'understood', 'next_action': 'continue',
        'feedback': 'Correct: keep voltage fixed when comparing resistance and current.',
        'missing_concepts': [],
    }))

    discussion_model = Mock()
    discussion_model.bind.return_value.invoke.return_value = AIMessage(content=json.dumps({
        'reply': 'At fixed voltage, doubling resistance halves current because current equals voltage divided by resistance.',
    }))

    # Keep HTTP/auth/persistence real; replace external generation and dispatch.
    with (
        patch.object(lesson_jobs, 'generate_answer', generate),
        patch('apps.classroom.services.lesson_evaluation.get_llm', return_value=evaluator),
        patch('apps.classroom.services.lesson_discussion.get_llm', return_value=discussion_model),
        patch('apps.classroom.services.lesson_discussion.provider_delay', return_value=0),
        patch('apps.classroom.services.lesson_provider_admission.provider_delay', return_value=0),
        patch.object(lesson_jobs, 'publish_lesson_job', lesson_jobs.run_lesson_job),
    ):
        call_command('runserver', f'127.0.0.1:{API_PORT}', use_reloader=False)


if __name__ == '__main__':
    main()
