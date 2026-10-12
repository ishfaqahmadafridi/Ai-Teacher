"""Answer persistence, ownership and duplicate submission coverage."""
import uuid
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.classroom.services.lecture_notes import save_lecture_note
from apps.classroom.models.lesson_attempt import LessonAttempt
from apps.classroom.tests.test_lecture_notes import lesson_answer


class LessonAnswerTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='lesson-answer', email='lesson@example.org')
        answer = lesson_answer()
        answer['chunks'][0]['question'] = 'What happens to current when resistance doubles?'
        answer['chunks'][0]['expected_concepts'] = ['Current halves at constant voltage']
        self.note = save_lecture_note(self.user, 'test-lesson', answer)
        self.client = APIClient()
        self.client.force_authenticate(self.user)
        self.url = f'/api/notes/{self.note.id}/answers/'
        self.payload = {'request_id': str(uuid.uuid4()), 'section_index': 0, 'answer': 'It halves.'}

    def test_repeated_request_saves_once(self):
        first = self.client.post(self.url, self.payload)
        second = self.client.post(self.url, self.payload)
        self.assertEqual(first.status_code, 200)
        self.assertEqual(first.data['id'], second.data['id'])
        self.assertEqual(LessonAttempt.objects.count(), 1)

    def test_reused_identifier_cannot_replace_answer(self):
        self.client.post(self.url, self.payload)
        response = self.client.post(self.url, {**self.payload, 'answer': 'It doubles.'})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(LessonAttempt.objects.get().answer, 'It halves.')

    def test_other_account_cannot_answer_private_lesson(self):
        other = get_user_model().objects.create_user(username='other-lesson', email='other-lesson@example.org')
        self.client.force_authenticate(other)
        self.assertEqual(self.client.post(self.url, self.payload).status_code, 404)

    def test_unknown_section_is_rejected(self):
        self.assertEqual(self.client.post(self.url, {**self.payload, 'section_index': 8}).status_code, 400)


    def test_pending_question_survives_new_client(self):
        url = f'/api/notes/{self.note.id}/progress/'
        saved = self.client.put(url, {'section_index': 0, 'waiting': True, 'revision': 0})
        self.assertEqual(saved.status_code, 200)
        fresh = APIClient()
        fresh.force_authenticate(self.user)
        restored = fresh.get(url)
        self.assertTrue(restored.data['waiting'])
        self.assertEqual(restored.data['question'], self.note.answer['chunks'][0]['question'])

    def test_stale_cursor_cannot_overwrite_newer_position(self):
        url = f'/api/notes/{self.note.id}/progress/'
        update = {'section_index': 0, 'waiting': True, 'revision': 0}
        self.assertEqual(self.client.put(url, update).status_code, 200)
        self.assertEqual(self.client.put(url, update).status_code, 409)

    def test_progress_is_private(self):
        self.client.force_authenticate(None)
        self.assertEqual(self.client.get(f'/api/notes/{self.note.id}/progress/').status_code, 401)
