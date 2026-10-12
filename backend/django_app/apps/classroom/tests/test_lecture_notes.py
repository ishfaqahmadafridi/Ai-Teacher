"""Saved lesson reuse, privacy and real-document API integration tests."""
from io import BytesIO
from unittest.mock import patch
import zipfile
from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient
from docx import Document
from apps.classroom.models.lecture_notes import LectureNote
from apps.classroom.services.lecture_notes import save_lecture_note


def lesson_answer(language='en'):
    return {'topic': 'Ohm law', 'language': language, 'diagram_type': 'circuit', 'chunks': [
        {'speak': 'Voltage equals current multiplied by resistance. 12 V / 4 ohms = 3 A.',
         'key_point': 'Voltage, current and resistance',
         'diagram': {'action': 'show_formula', 'formula': 'V = I × R', 'annotation': 'Current increases with voltage.'}}
    ]}


class LectureNotesTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='note-test-user', email='notes@example.org', password='test-password')
        self.other = get_user_model().objects.create_user(username='other-note-test-user', email='other-notes@example.org', password='test-password')
        self.client = APIClient()
        self.client.force_authenticate(self.user)
        self.note = save_lecture_note(self.user, 'lesson-session', lesson_answer())

    def test_versions_are_deduplicated_but_changed_answers_create_new_version(self):
        repeated = save_lecture_note(self.user, 'lesson-session', lesson_answer())
        self.assertEqual(repeated.id, self.note.id)
        changed = lesson_answer()
        changed['chunks'][0]['speak'] = 'Corrected explanation'
        self.assertNotEqual(save_lecture_note(self.user, 'lesson-session', changed).id, self.note.id)
        self.assertEqual(LectureNote.objects.count(), 2)

    @patch('apps.classroom.services.note_translation.get_llm')
    def test_list_and_word_download_reuse_saved_content_without_llm(self, llm):
        response = self.client.get('/api/notes/', {'session_id': 'lesson-session'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['sections'][0]['formula'], 'V = I × R')
        for _ in range(2):
            result = self.client.get(f'/api/notes/{self.note.id}/document/', {'language': 'en'})
            self.assertEqual(result.status_code, 200)
            document = Document(BytesIO(result.content))
            text = '\n'.join(p.text for p in document.paragraphs)
            self.assertIn('12 V / 4 ohms = 3 A', text)
            self.assertIn('V = I × R', text)
        llm.assert_not_called()

    def test_notes_and_exports_are_account_private(self):
        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.get('/api/notes/', {'session_id': 'lesson-session'}).data, [])
        self.assertEqual(self.client.get(f'/api/notes/{self.note.id}/document/', {'language': 'en'}).status_code, 404)
        self.assertEqual(self.client.post(f'/api/notes/{self.note.id}/translate/', {'language': 'ur'}).status_code, 404)

    def test_guest_cannot_read_notes(self):
        self.client.force_authenticate(None)
        self.assertEqual(self.client.get('/api/notes/', {'session_id': 'lesson-session'}).status_code, 401)

    @patch('apps.classroom.services.note_translation.get_llm')
    def test_download_never_implicitly_translates(self, llm):
        result = self.client.get(f'/api/notes/{self.note.id}/document/', {'language': 'ur'})
        self.assertEqual(result.status_code, 400)
        llm.assert_not_called()

    def test_urdu_document_contains_rtl_paragraph_and_run_properties(self):
        note = save_lecture_note(self.user, 'lesson-session', lesson_answer('ur'))
        response = self.client.get(f'/api/notes/{note.id}/document/', {'language': 'ur'})
        self.assertEqual(response.status_code, 200)
        xml = zipfile.ZipFile(BytesIO(response.content)).read('word/document.xml')
        self.assertIn(b'w:bidi', xml)
        self.assertIn(b'w:rtl', xml)

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

    def test_regional_source_language_is_normalized_for_original_export(self):
        note = save_lecture_note(self.user, 'regional-session', lesson_answer('en-US'))
        self.assertEqual(note.answer['language'], 'en')
        response = self.client.get(f'/api/notes/{note.id}/document/', {'language': 'en'})
        self.assertEqual(response.status_code, 200)

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
