"""Hand requests are private, durable and independent of the question clock."""
from django.test import TestCase
from apps.classroom.tests.lecture_note_fixtures import LectureNotesFixture
from apps.classroom.models.lesson_attempt import LessonProgress


class LessonHandTests(LectureNotesFixture, TestCase):
    def test_raise_read_and_lower_use_the_authenticated_account_name(self):
        self.user.first_name = 'Ishfaq'
        self.user.save()
        url = f'/api/notes/{self.note.pk}/hand/'
        self.assertFalse(self.client.get(url).data['hand_raised'])
        raised = self.client.put(url, {'hand_raised': True})
        self.assertEqual(raised.status_code, 200)
        self.assertTrue(LessonProgress.objects.get(note=self.note).hand_raised)
        self.assertEqual(self.client.get(url).data['invitation'], 'Ishfaq, what is your question about this concept?')
        self.client.put(url, {'hand_raised': False})
        self.assertFalse(self.client.get(url).data['hand_raised'])

    def test_hand_changes_do_not_restart_the_question_clock_or_move_the_cursor(self):
        progress = LessonProgress.objects.create(note=self.note, waiting=True, revision=3)
        timestamp = progress.updated_at
        self.client.put(f'/api/notes/{self.note.pk}/hand/', {'hand_raised': True})
        progress.refresh_from_db()
        self.assertEqual(progress.updated_at, timestamp)
        self.assertEqual(progress.revision, 3)
        self.assertTrue(progress.waiting)
        self.assertEqual(progress.section_index, 0)

    def test_other_accounts_cannot_read_or_change_a_hand_request(self):
        self.client.force_authenticate(self.other)
        url = f'/api/notes/{self.note.pk}/hand/'
        self.assertEqual(self.client.get(url).status_code, 404)
        self.assertEqual(self.client.put(url, {'hand_raised': True}).status_code, 404)
        self.assertFalse(LessonProgress.objects.filter(note=self.note).exists())

    def test_missing_value_is_rejected_and_blank_first_name_uses_account_username(self):
        url = f'/api/notes/{self.note.pk}/hand/'
        self.assertEqual(self.client.put(url, {}, format="json").status_code, 400)
        self.assertTrue(self.client.get(url).data['invitation'].startswith(self.user.username + ','))
