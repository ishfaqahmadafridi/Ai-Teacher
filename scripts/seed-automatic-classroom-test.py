"""Seed short, admitted synthetic classes into the isolated browser-test database."""
import json
import os
from pathlib import Path
import sys
import tempfile
from datetime import timedelta
from uuid import uuid4

ROOT = Path(__file__).resolve().parents[1]
STATE_DIR = Path(os.environ.get('CLASSROOM_E2E_STATE_DIR', Path(tempfile.gettempdir()) / 'ai-teacher-e2e'))
sys.path.insert(0, str(ROOT / 'backend' / 'django_app'))
os.environ['DJANGO_SETTINGS_MODULE'] = 'config.settings.test'

import django
from django.conf import settings
settings.DATABASES['default']['NAME'] = str(STATE_DIR / 'db.sqlite3')
django.setup()

from django.contrib.auth import get_user_model
from django.utils import timezone
from apps.dashboard.models import SessionAttendance, SessionOccurrence
from apps.classroom.models.lesson_job import LessonJob
from apps.classroom.services.lecture_notes import save_lecture_note

user = get_user_model().objects.get(username='contract-e2e')
now = timezone.now()
answer = {'topic': 'Ohm law', 'language': 'en', 'diagram_type': 'circuit', 'chunks': [
    {'speak': 'At fixed voltage, increasing resistance reduces current.', 'key_point': 'Voltage and resistance', 'diagram': {'action': 'none'}},
    {'speak': 'What happens to current when resistance doubles at fixed voltage?',
     'question': 'What happens to current when resistance doubles at fixed voltage?',
     'expected_concepts': ['Current halves at fixed voltage'], 'diagram': {'action': 'none'}},
    {'speak': 'The current halves. This completes our lesson.', 'key_point': 'Lesson recap', 'diagram': {'action': 'none'}},
]}
fixtures = []
for start_delay, end_delay in [(8, 30), (30, 38)]:
    session_id = uuid4()
    start, end = now + timedelta(seconds=start_delay), now + timedelta(seconds=end_delay)
    SessionOccurrence.objects.create(user=user, session_id=session_id, session_date=start.date(),
        starts_at=start, ends_at=end, timezone='UTC', title='Ohm law', subject='Physics')
    SessionAttendance.objects.create(user=user, session_id=session_id, session_date=start.date(),
        status='attended', joined_at=now - timedelta(minutes=1))
    note = save_lecture_note(user, str(session_id), answer)
    LessonJob.objects.create(user=user, request_id=uuid4(), flight_key=str(uuid4()), status='ready',
        inputs={'scheduled_session_id': str(session_id)}, result={'model_info': {'note_id': str(note.pk)}})
    fixtures.append({'sessionId': str(session_id), 'startsAt': start.isoformat(), 'endsAt': end.isoformat()})
(STATE_DIR / 'automatic-classes.json').write_text(json.dumps(fixtures))
