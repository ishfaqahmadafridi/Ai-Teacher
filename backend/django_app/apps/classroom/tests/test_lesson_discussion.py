"""Timed Q&A remains distinct from grading and cannot refresh its deadline."""
import uuid
from datetime import timedelta
from unittest.mock import Mock, patch
from django.test import TestCase
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.classroom.services.lecture_notes import save_lecture_note
from apps.classroom.tests.lecture_note_fixtures import lesson_answer
from apps.classroom.models.lesson_attempt import LessonAttempt, LessonProgress
from apps.classroom.serializers.answer_serializers import GeneratedAnswerSerializer
from apps.classroom.constants.lesson import DISCUSSION_WINDOW_SECONDS


class LessonDiscussionTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='discussion', email='discussion@example.org')
        answer = lesson_answer()
        answer['chunks'] += [{'speak': 'Any questions about resistance?', 'discussion_prompt': 'Any questions about resistance?', 'diagram': {'action': 'none'}},
                             {'speak': 'Now continue to the next concept.', 'diagram': {'action': 'none'}}]
        self.note = save_lecture_note(self.user, 'discussion', answer)
        self.client = APIClient()
        self.client.force_authenticate(self.user)
        self.progress_url = f'/api/notes/{self.note.pk}/progress/'
        self.url = f'/api/notes/{self.note.pk}/discussion/'
        self.payload = {'request_id': str(uuid.uuid4()), 'section_index': 1, 'question': 'Why does current halve?'}

    def open(self):
        return self.client.put(self.progress_url, {'section_index': 1, 'waiting': True, 'revision': 0})

    def test_open_returns_a_thirty_second_server_deadline_and_retries_do_not_extend_it(self):
        first = self.open()
        self.assertEqual(first.status_code, 200)
        from datetime import datetime
        expires = datetime.fromisoformat(first.data['discussion_expires_at'])
        now = datetime.fromisoformat(first.data['server_now'])
        self.assertAlmostEqual((expires - now).total_seconds(), DISCUSSION_WINDOW_SECONDS, delta=1)
        again = self.open()
        self.assertEqual(again.status_code, 200)
        self.assertEqual(first.data['discussion_expires_at'], again.data['discussion_expires_at'])
        self.assertEqual(again.data['revision'], first.data['revision'])

    @patch('apps.classroom.services.lesson_discussion.get_llm')
    @patch('apps.classroom.services.lesson_discussion.provider_delay', return_value=0)
    def test_reply_is_saved_and_reused_without_grading_or_changing_the_lesson(self, admission, provider):
        self.open()
        provider.return_value.bind.return_value.invoke.return_value = Mock(text='{"reply":"At fixed voltage, current is inversely proportional to resistance."}')
        first = self.client.post(self.url, self.payload)
        self.assertEqual(first.status_code, 200)
        self.assertIn('inversely', first.data['reply'])
        retry = self.client.post(self.url, self.payload)
        self.assertEqual(retry.data, first.data)
        provider.return_value.bind.return_value.invoke.assert_called_once()
        attempt = LessonAttempt.objects.get()
        self.assertEqual(attempt.answer, self.payload['question'])
        self.assertNotIn('outcome', attempt.evaluation)
        self.assertTrue(LessonProgress.objects.get(note=self.note).waiting)
        self.note.refresh_from_db()
        self.assertEqual(len(self.note.answer['chunks']), 3)
        self.assertEqual(self.client.post(f'/api/notes/{self.note.pk}/answers/{attempt.pk}/evaluate/').status_code, 400)

    @patch('apps.classroom.services.lesson_discussion.get_llm')
    def test_closed_or_missing_period_never_calls_a_provider(self, provider):
        self.assertEqual(self.client.post(self.url, self.payload).status_code, 409)
        self.open()
        LessonProgress.objects.filter(note=self.note).update(updated_at=timezone.now() - timedelta(seconds=DISCUSSION_WINDOW_SECONDS))
        self.assertEqual(self.client.post(self.url, self.payload).status_code, 409)
        provider.assert_not_called()
        self.assertEqual(LessonAttempt.objects.count(), 0)

    def test_no_question_timeout_can_advance_without_a_fake_attempt_or_grade(self):
        self.open()
        result = self.client.put(self.progress_url, {'section_index': 2, 'waiting': False, 'revision': 1})
        self.assertEqual(result.status_code, 200)
        self.assertIsNone(result.data['question'])
        self.assertIsNone(result.data['discussion_expires_at'])
        self.assertFalse(LessonAttempt.objects.exists())

    @patch('apps.classroom.services.lesson_discussion.get_llm')
    def test_other_account_cannot_ask_about_private_notes(self, provider):
        other = get_user_model().objects.create_user(username='discussion-other', email='discussion-other@example.org')
        self.client.force_authenticate(other)
        self.assertEqual(self.client.post(self.url, self.payload).status_code, 404)
        provider.assert_not_called()

    def test_invitation_and_assessment_fields_cannot_be_mixed(self):
        answer = self.note.answer
        answer['chunks'][1]['question'] = 'Test question'
        answer['chunks'][1]['expected_concepts'] = ['A criterion']
        serializer = GeneratedAnswerSerializer(data=answer)
        self.assertFalse(serializer.is_valid())

    @patch('apps.classroom.services.lesson_discussion.get_llm', return_value=None)
    @patch('apps.classroom.services.lesson_discussion.provider_delay', return_value=0)
    def test_provider_failure_keeps_the_saved_question_and_releases_its_lease(self, admission, provider):
        self.open()
        self.assertEqual(self.client.post(self.url, self.payload).status_code, 503)
        attempt = LessonAttempt.objects.get()
        self.assertEqual(attempt.answer, self.payload['question'])
        self.assertIsNone(attempt.evaluating_since)
        self.assertEqual(attempt.evaluation, {})
        self.assertTrue(LessonProgress.objects.get(note=self.note).waiting)

    @patch('apps.classroom.services.lesson_discussion.get_llm')
    @patch('apps.classroom.services.lesson_discussion.provider_delay', return_value=30)
    def test_shared_quota_defers_a_reply_without_calling_the_model(self, admission, provider):
        self.open()
        self.assertEqual(self.client.post(self.url, self.payload).status_code, 503)
        provider.assert_not_called()
        self.assertIsNone(LessonAttempt.objects.get().evaluating_since)
