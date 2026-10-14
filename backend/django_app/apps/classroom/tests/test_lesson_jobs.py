"""Queue ownership, duplicate suppression, backpressure and durable worker output."""
from uuid import uuid4
from unittest.mock import patch
from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from rest_framework.test import APIClient
from rest_framework.exceptions import ValidationError
from apps.classroom.models.lesson_job import LessonJob
from apps.classroom.services.lesson_jobs import submit_lesson_job, run_lesson_job, LessonQueueFull
from apps.classroom.tests.test_lecture_notes import lesson_answer


class LessonJobTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='jobs-user', email='jobs@example.org')
        self.other = get_user_model().objects.create_user(username='jobs-other', email='otherjobs@example.org')
        self.inputs = {'question': 'Explain Ohm law', 'session_id': 'jobs-session', 'temperature': 0.7, 'research': True}
        self.request_id = uuid4()
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def submit(self, inputs=None, request_id=None):
        return submit_lesson_job(self.user, request_id or self.request_id, inputs or self.inputs)

    def test_request_and_active_generation_are_deduplicated(self):
        job = self.submit()
        self.assertEqual(self.submit().pk, job.pk)
        self.assertEqual(self.submit(request_id=uuid4()).pk, job.pk)
        self.assertEqual(LessonJob.objects.count(), 1)

    def test_request_id_cannot_change_question(self):
        self.submit()
        with self.assertRaises(ValidationError):
            self.submit({**self.inputs, 'question': 'Different'})

    @override_settings(CLASSROOM_MAX_PENDING_JOBS=1)
    def test_global_backpressure(self):
        self.submit()
        with self.assertRaises(LessonQueueFull):
            self.submit({**self.inputs, 'question': 'Different'}, uuid4())

    def test_other_account_cannot_poll_job(self):
        job = self.submit()
        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.get(f'/api/lesson-jobs/{job.pk}/').status_code, 404)

    @patch('apps.classroom.services.lesson_provider_admission.provider_delay', return_value=0)
    @patch('apps.classroom.services.lesson_jobs.generate_answer')
    def test_worker_persists_notes_and_duplicate_delivery_does_not_generate_again(self, generate, admission):
        answer = lesson_answer()
        answer['model_info'] = {}
        generate.return_value = answer
        job = self.submit()
        run_lesson_job(str(job.pk))
        run_lesson_job(str(job.pk))
        job.refresh_from_db()
        self.assertEqual(job.status, 'ready')
        self.assertIn('note_id', job.result['model_info'])
        generate.assert_called_once()

    @patch('apps.classroom.services.lesson_provider_admission.provider_delay', return_value=30)
    @patch('apps.classroom.services.lesson_jobs.generate_answer')
    def test_quota_defers_without_calling_llm(self, generate, admission):
        job = self.submit()
        run_lesson_job(str(job.pk))
        job.refresh_from_db()
        self.assertEqual(job.status, 'queued')
        self.assertIsNotNone(job.next_attempt_at)
        generate.assert_not_called()

    def test_anonymous_submission_requires_authentication(self):
        self.client.force_authenticate(None)
        response = self.client.post('/api/lesson-jobs/', {**self.inputs, 'request_id': str(uuid4())}, format='json')
        self.assertEqual(response.status_code, 401)

    @patch('apps.classroom.services.lesson_provider_admission.provider_delay', return_value=0)
    @patch('apps.classroom.services.lesson_jobs.generate_answer')
    def test_alias_retry_remains_bound_after_job_completes(self, generate, admission):
        generate.return_value = {**lesson_answer(), 'model_info': {}}
        job = self.submit()
        alias = uuid4()
        self.assertEqual(self.submit(request_id=alias).pk, job.pk)
        run_lesson_job(str(job.pk))
        self.assertEqual(self.submit(request_id=alias).pk, job.pk)
        generate.assert_called_once()

    @override_settings(CLASSROOM_BREAKER_FAILURES=1)
    @patch('apps.classroom.services.lesson_provider_admission.provider_delay', return_value=0)
    @patch('apps.classroom.services.lesson_jobs.generate_answer', return_value={'topic': 'unknown'})
    def test_failure_opens_breaker_and_defers_next_job(self, generate, admission):
        first = self.submit()
        run_lesson_job(str(first.pk))
        second = self.submit({**self.inputs, 'question': 'New'}, uuid4())
        run_lesson_job(str(second.pk))
        second.refresh_from_db()
        self.assertEqual(second.status, 'queued')
        self.assertIsNotNone(second.next_attempt_at)
        generate.assert_called_once()

    @patch('apps.classroom.services.lesson_jobs.publish_lesson_job')
    def test_real_api_submit_worker_and_poll_flow(self, publish):
        response = self.client.post('/api/lesson-jobs/', {**self.inputs, 'request_id': str(self.request_id)}, format='json')
        self.assertEqual(response.status_code, 202)
        job_id = response.data['id']
        with patch('apps.classroom.services.lesson_provider_admission.provider_delay', return_value=0), patch('apps.classroom.services.lesson_jobs.generate_answer', return_value={**lesson_answer(), 'model_info': {}}):
            run_lesson_job(str(job_id))
        polled = self.client.get(f'/api/lesson-jobs/{job_id}/')
        self.assertEqual(polled.status_code, 200)
        self.assertEqual(polled.data['status'], 'ready')
        self.assertIn('note_id', polled.data['result']['model_info'])

    @override_settings(CLASSROOM_MAX_PENDING_JOBS=200)
    @patch('apps.classroom.services.lesson_jobs.generate_answer')
    def test_thousand_student_submissions_are_bounded_without_provider_calls(self, generate):
        users = get_user_model().objects.bulk_create([
            get_user_model()(username=f'load-student-{index}', email=f'load-{index}@example.invalid', password='!')
            for index in range(1000)
        ])
        counts = {202: 0, 429: 0}
        for user in users:
            self.client.force_authenticate(user)
            response = self.client.post('/api/lesson-jobs/', {**self.inputs, 'request_id': str(uuid4())}, format='json')
            self.assertIn(response.status_code, counts)
            counts[response.status_code] += 1
        self.assertEqual(counts, {202: 200, 429: 800})
        self.assertEqual(LessonJob.objects.filter(status='queued').count(), 200)
        generate.assert_not_called()

    def test_queue_metrics_are_staff_only(self):
        self.assertEqual(self.client.get('/api/lesson-jobs/metrics/').status_code, 403)
        self.user.is_staff = True
        self.user.save(update_fields=['is_staff'])
        response = self.client.get('/api/lesson-jobs/metrics/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('counts', response.data)
        self.assertNotIn('question', response.data)

    @patch('apps.classroom.services.lesson_provider_admission.provider_delay', side_effect=RuntimeError('Redis down'))
    @patch('apps.classroom.services.lesson_jobs.generate_answer')
    def test_admission_outage_fails_closed(self, generate, admission):
        job = self.submit()
        run_lesson_job(str(job.pk))
        job.refresh_from_db()
        self.assertEqual(job.status, 'queued')
        self.assertIsNotNone(job.next_attempt_at)
        generate.assert_not_called()

    @patch('apps.classroom.services.lesson_provider_admission.provider_delay', return_value=0)
    def test_expired_worker_result_cannot_write_notes_or_history(self, admission):
        job = self.submit()
        def expire_during_generation(**kwargs):
            self.assertFalse(kwargs['persist_history'])
            LessonJob.objects.filter(pk=job.pk).update(status='failed')
            return {**lesson_answer(), 'model_info': {}}
        with patch('apps.classroom.services.lesson_jobs.generate_answer', side_effect=expire_during_generation):
            run_lesson_job(str(job.pk))
        from apps.classroom.models import LectureNote, ClassroomSession
        self.assertFalse(LectureNote.objects.filter(user=self.user).exists())
        self.assertEqual(ClassroomSession.objects.count(), 0)

    @patch('apps.classroom.services.lesson_provider_admission.provider_delay', return_value=0)
    @patch('apps.classroom.services.lesson_jobs.generate_answer')
    def test_later_session_turn_waits_for_older_queued_turn(self, generate, admission):
        self.submit()
        later = self.submit({**self.inputs, 'question': 'Follow-up'}, uuid4())
        run_lesson_job(str(later.pk))
        later.refresh_from_db()
        self.assertEqual(later.status, 'queued')
        generate.assert_not_called()
