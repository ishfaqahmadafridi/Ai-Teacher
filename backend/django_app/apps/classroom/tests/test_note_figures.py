"""Bounded visual snapshots and Word image embedding regression tests."""
import base64
import tempfile
from io import BytesIO
from django.test import TestCase, override_settings
from django.contrib.auth import get_user_model
from PIL import Image
from docx import Document
from rest_framework.exceptions import ValidationError
from apps.classroom.services.lecture_notes import save_lecture_note, note_content
from apps.classroom.services.note_figures import save_note_figure, note_figures
from apps.classroom.services.note_document import create_note_document
from apps.classroom.tests.lecture_note_fixtures import lesson_answer


class NoteFigureTests(TestCase):
    def setUp(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        settings = override_settings(MEDIA_ROOT=directory.name)
        settings.enable()
        self.addCleanup(settings.disable)
        user = get_user_model().objects.create_user(username='note-test-user', email='figure@example.org', password='test-password')
        self.note = save_lecture_note(user, 'session', lesson_answer())
        buffer = BytesIO()
        Image.new('RGB', (20, 20), color='white').save(buffer, format='PNG')
        self.image = base64.b64encode(buffer.getvalue()).decode()

    def test_saved_snapshot_is_embedded_and_duplicate_upload_is_idempotent(self):
        save_note_figure(self.note, 0, self.image)
        save_note_figure(self.note, 0, self.image)
        self.assertEqual(self.note.figures.count(), 1)
        data = create_note_document(note_content(self.note), note_figures(self.note))
        self.assertEqual(len(Document(BytesIO(data)).inline_shapes), 1)

    def test_malformed_png_and_unknown_section_are_rejected(self):
        for section, image in [(0, 'not-base64'), (2, self.image)]:
            with self.subTest(section=section), self.assertRaises(ValidationError):
                save_note_figure(self.note, section, image)
        self.assertEqual(self.note.figures.count(), 0)

    def test_figure_api_requires_ownership_and_returns_saved_png(self):
        from rest_framework.test import APIClient
        client = APIClient()
        client.force_authenticate(self.note.user)
        response = client.post(f'/api/notes/{self.note.id}/figures/', {'section_index': 0, 'image': self.image})
        self.assertEqual(response.status_code, 204)
        response = client.get(f'/api/notes/{self.note.id}/figures/', {'section_index': 0})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.content.startswith(b'\x89PNG'))
        other = get_user_model().objects.create_user(username='another-figure-user', password='test-password')
        client.force_authenticate(other)
        self.assertEqual(client.get(f'/api/notes/{self.note.id}/figures/', {'section_index': 0}).status_code, 404)
