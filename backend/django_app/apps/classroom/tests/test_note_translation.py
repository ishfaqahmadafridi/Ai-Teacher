"""Translation cache reuse, schema validation and failure recovery tests."""
import json
from types import SimpleNamespace
from unittest.mock import patch
from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.classroom.models.lecture_notes import NoteTranslation
from apps.classroom.services.lecture_notes import save_lecture_note, note_content
from apps.classroom.services.note_translation import translate_note, TranslationUnavailable, TranslationProcessing
from apps.classroom.tests.test_lecture_notes import lesson_answer


class NoteTranslationTests(TestCase):
    def setUp(self):
        user = get_user_model().objects.create_user(username='note-test-user', email='translate@example.org', password='test-password')
        self.note = save_lecture_note(user, 'session', lesson_answer())

    @patch('apps.classroom.services.note_translation.get_llm')
    def test_translation_is_saved_once_and_reused_without_tokens(self, llm):
        content = note_content(self.note)
        content['language'] = 'ur'
        content['sections'][0]['formula'] = 'changed formula'
        llm.return_value.bind.return_value.invoke.return_value = SimpleNamespace(text=json.dumps(content), usage_metadata={'total_tokens': 123})
        translated, tokens = translate_note(self.note, 'ur')
        self.assertEqual(tokens, 123)
        self.assertEqual(translated['sections'][0]['formula'], 'V = I × R')
        cached, tokens = translate_note(self.note, 'ur')
        self.assertEqual(cached, translated)
        self.assertEqual(tokens, 0)
        llm.assert_called_once()

    @patch('apps.classroom.services.note_translation.get_llm')
    def test_original_language_does_not_call_llm(self, llm):
        self.assertEqual(translate_note(self.note, 'en'), (note_content(self.note), 0))
        llm.assert_not_called()

    @patch('apps.classroom.services.note_translation.get_llm')
    def test_processing_translation_blocks_duplicate_provider_calls(self, llm):
        NoteTranslation.objects.create(note=self.note, language='ur')
        with self.assertRaises(TranslationProcessing):
            translate_note(self.note, 'ur')
        llm.assert_not_called()

    @patch('apps.classroom.services.note_translation.get_llm')
    def test_malformed_translation_is_not_cached_and_can_be_retried(self, llm):
        llm.return_value.bind.return_value.invoke.return_value = SimpleNamespace(text='invalid', usage_metadata={})
        with self.assertRaises(TranslationUnavailable):
            translate_note(self.note, 'ur')
        self.assertEqual(NoteTranslation.objects.get(note=self.note).status, 'failed')
        llm.return_value.bind.return_value.invoke.return_value = SimpleNamespace(text=json.dumps({**note_content(self.note), 'language': 'ur'}), usage_metadata={})
        translate_note(self.note, 'ur')
        self.assertEqual(NoteTranslation.objects.get(note=self.note).status, 'ready')

    @patch('apps.classroom.services.note_translation.get_llm')
    def test_changed_calculation_values_are_rejected(self, llm):
        content = {**note_content(self.note), 'language': 'ur'}
        content['sections'][0]['explanation'] = '12 V / 4 ohms = 4 A.'
        llm.return_value.bind.return_value.invoke.return_value = SimpleNamespace(text=json.dumps(content), usage_metadata={})
        with self.assertRaises(TranslationUnavailable):
            translate_note(self.note, 'ur')
        self.assertEqual(NoteTranslation.objects.get(note=self.note).status, 'failed')
