"""Shared setup for focused backend regression suites."""
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.classroom.services.lecture_notes import save_lecture_note

def lesson_answer(language='en'):
    return {'topic': 'Ohm law', 'language': language, 'diagram_type': 'circuit', 'chunks': [
        {'speak': 'Voltage equals current multiplied by resistance. 12 V / 4 ohms = 3 A.',
         'key_point': 'Voltage, current and resistance',
         'diagram': {'action': 'show_formula', 'formula': 'V = I × R', 'annotation': 'Current increases with voltage.'}}
    ]}


class LectureNotesFixture:
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='note-test-user', email='notes@example.org', password='test-password')
        self.other = get_user_model().objects.create_user(username='other-note-test-user', email='other-notes@example.org', password='test-password')
        self.client = APIClient()
        self.client.force_authenticate(self.user)
        self.note = save_lecture_note(self.user, 'lesson-session', lesson_answer())
