"""Private audio API and real WAV validation contracts."""
from unittest.mock import patch
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.classroom.services.lecture_notes import save_lecture_note
from apps.classroom.tests.test_lecture_notes import lesson_answer


class LessonAudioTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='audio-user', email='audio@example.org')
        self.note = save_lecture_note(self.user, 'audio', lesson_answer())
        self.url = f'/api/notes/{self.note.id}/audio/0/'
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    @patch('apps.classroom.services.lesson_audio.generate_audio', return_value=b'RIFFtestWAVE')
    def test_saved_chunk_generates_private_audio_without_llm(self, generate):
        result = self.client.post(self.url, {'speak': self.note.answer['chunks'][0]['speak']})
        self.assertEqual(result.status_code, 200)
        self.assertEqual(result['Content-Type'], 'audio/wav')
        self.assertEqual(result['Cache-Control'], 'private, no-store')
        generate.assert_called_once()

    @patch('apps.classroom.services.lesson_audio.generate_audio')
    def test_arbitrary_text_cannot_replace_saved_audio(self, generate):
        self.assertEqual(self.client.post(self.url, {'speak': 'Different text'}).status_code, 400)
        generate.assert_not_called()

    def test_another_account_cannot_read_audio(self):
        user = get_user_model().objects.create_user(username='audio-other', email='audio-other@example.org')
        self.client.force_authenticate(user)
        self.assertEqual(self.client.get(self.url).status_code, 404)
