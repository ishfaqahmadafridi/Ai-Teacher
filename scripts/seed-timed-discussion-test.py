"""Prepare private synthetic self-study notes for the timed concept Q&A browser test."""
import json
import os
from pathlib import Path
import sys
import tempfile
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
from apps.classroom.services.lecture_notes import save_lecture_note

user = get_user_model().objects.get(username='contract-e2e')
answer = {'topic': 'Resistance', 'language': 'en', 'diagram_type': 'default', 'chunks': [
    {'speak': 'At fixed voltage, current is inversely proportional to resistance.', 'key_point': 'Resistance and current', 'diagram': {'action': 'none'}},
    {'speak': 'Do you have any questions about resistance and current?',
     'discussion_prompt': 'Do you have any questions about resistance and current?', 'diagram': {'action': 'none'}},
    {'speak': 'Now we continue to the next concept.', 'key_point': 'Next concept', 'diagram': {'action': 'none'}},
]}
ids = [str(save_lecture_note(user, f'timed-qa-{uuid4()}', answer).pk) for _ in range(2)]
(STATE_DIR / 'timed-discussion-notes.json').write_text(json.dumps(ids))
