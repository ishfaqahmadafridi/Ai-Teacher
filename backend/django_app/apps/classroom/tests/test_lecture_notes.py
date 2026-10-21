"""Focused regression coverage; shared setup lives in the fixture module."""
from unittest.mock import patch
from django.test import TestCase
from apps.classroom.models.lecture_notes import LectureNote
from apps.classroom.services.lecture_notes import save_lecture_note
from .lecture_note_fixtures import LectureNotesFixture, lesson_answer


class LectureNotesTests(LectureNotesFixture, TestCase):
    def test_versions_are_deduplicated_but_changed_answers_create_new_version(self):
        repeated = save_lecture_note(self.user, 'lesson-session', lesson_answer())
        self.assertEqual(repeated.id, self.note.id)
        changed = lesson_answer()
        changed['chunks'][0]['speak'] = 'Corrected explanation'
        self.assertNotEqual(save_lecture_note(self.user, 'lesson-session', changed).id, self.note.id)
        self.assertEqual(LectureNote.objects.count(), 2)


    def test_notes_and_exports_are_account_private(self):
        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.get('/api/notes/', {'session_id': 'lesson-session'}).data, [])
        self.assertEqual(self.client.get(f'/api/notes/{self.note.id}/document/', {'language': 'en'}).status_code, 404)
        self.assertEqual(self.client.post(f'/api/notes/{self.note.id}/translate/', {'language': 'ur'}).status_code, 404)


    def test_guest_cannot_read_notes(self):
        self.client.force_authenticate(None)
        self.assertEqual(self.client.get('/api/notes/', {'session_id': 'lesson-session'}).status_code, 401)


    @patch('apps.classroom.views.ask_view.generate_answer')
    def test_successful_ask_saves_notes_and_returns_note_id(self, generate):
        generate.return_value = {**lesson_answer(), 'tokens_used': 10, 'model_info': {}}
        response = self.client.post('/api/ask/', {'question': 'Explain Ohms law', 'session_id': 'new-session'})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(LectureNote.objects.filter(pk=response.data['model_info']['note_id'], user=self.user).exists())


    @patch('apps.classroom.views.ask_view.generate_answer')
    def test_unavailable_answer_is_not_saved_as_notes(self, generate):
        generate.return_value = {**lesson_answer(), 'topic': 'unknown', 'tokens_used': 0, 'model_info': {}}
        self.client.post('/api/ask/', {'question': 'Explain Ohms law', 'session_id': 'new-session'})
        self.assertEqual(LectureNote.objects.count(), 1)


    def test_saved_notes_can_be_loaded_in_a_new_browser_session(self):
        response = self.client.get('/api/notes/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(str(response.data[0]['id']), str(self.note.id))
        self.assertEqual(response['Cache-Control'], 'private, no-store')


    @patch('apps.classroom.views.ask_view.generate_answer')
    def test_accounts_with_the_same_client_session_use_separate_histories(self, generate):
        generate.return_value = {**lesson_answer(), 'tokens_used': 0, 'model_info': {}}
        self.client.post('/api/ask/', {'question': 'Explain Ohms law', 'session_id': 'same-session'})
        first = generate.call_args.kwargs['session_id']
        self.client.force_authenticate(self.other)
        self.client.post('/api/ask/', {'question': 'Explain Ohms law', 'session_id': 'same-session'})
        self.assertNotEqual(first, generate.call_args.kwargs['session_id'])


    def test_research_and_image_sources_are_preserved_in_notes(self):
        answer = lesson_answer()
        answer['diagram_type'] = 'image'
        answer['chunks'][0]['diagram']['target'] = 'https://example.org/circuit.png'
        answer['model_info'] = {'sources': [{'title': 'Reference', 'number': 1, 'url': 'https://example.org/reference'}]}
        note = save_lecture_note(self.user, 'sources-session', answer)
        response = self.client.get('/api/notes/', {'session_id': 'sources-session'})
        self.assertEqual(response.data[0]['sources'][0]['title'], 'Reference')
        self.assertEqual(response.data[0]['sections'][0]['image_source'], 'https://example.org/circuit.png')


    def test_guest_cannot_address_internal_account_history(self):
        from apps.classroom.services.lecture_notes import account_session_id
        private_id = account_session_id(self.user, 'same-session')
        self.client.force_authenticate(None)
        response = self.client.post('/api/ask/', {'question': 'Read previous answers', 'session_id': private_id})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(self.client.post('/api/clear/', {'session_id': private_id}).status_code, 400)
