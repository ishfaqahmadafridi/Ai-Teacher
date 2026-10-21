"""Repairs create a reusable new version and preserve original lesson text."""
from unittest.mock import patch
from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from django.core.cache import cache
from apps.classroom.services.lecture_notes import save_lecture_note
from apps.classroom.services.visual_repair import repair_note_visuals
from apps.classroom.tests.lecture_note_fixtures import lesson_answer

@override_settings(CACHES={'default':{'BACKEND':'django.core.cache.backends.locmem.LocMemCache'}})
class VisualRepairTests(TestCase):
    @patch('apps.classroom.services.visual_repair.plan_missing_visuals', return_value=0)
    @patch('apps.classroom.services.visual_repair.resolve_lesson_visuals')
    def test_new_version_is_reused_without_changing_original(self, resolve, plan):
        cache.clear()
        user=get_user_model().objects.create_user(username='repair-test',email='repair@example.invalid')
        note=save_lecture_note(user,'repair-test',lesson_answer())
        def attach(answer):
            answer['chunks'][0]['diagram']['visual_status']='unavailable'
            return answer
        resolve.side_effect=attach
        repaired=repair_note_visuals(note.id)
        note.refresh_from_db()
        self.assertNotEqual(note.id,repaired.id)
        self.assertNotIn('visual_status',note.answer['chunks'][0]['diagram'])
        self.assertEqual(repair_note_visuals(note.id).id,repaired.id)
        resolve.assert_called_once()
