"""Focused regression coverage; shared setup lives in the fixture module."""
from unittest.mock import patch
from django.test import TestCase
from apps.dashboard.models import TimetableJob
from apps.dashboard.tasks import generate_timetable
from .timetable_fixtures import TimetableFixture


class TimetableJobTests(TimetableFixture, TestCase):
    def test_broker_failure_is_visible(self):
        with patch('apps.dashboard.services.timetable_request_service.generate_timetable.delay', side_effect=RuntimeError('unavailable')):
            with self.captureOnCommitCallbacks(execute=True):
                response = self.client.post('/api/dashboard/timetable/generate/', self.preferences, format='json')
        self.assertEqual(self.client.get(f"/api/dashboard/timetable/jobs/{response.data['id']}/").data['status'], 'queued')


    def test_worker_does_not_publish_result_after_job_is_cancelled(self):
        job = TimetableJob.objects.create(user=self.user, fingerprint='cancelled-during-work', inputs=self.inputs)
        def cancel_and_plan(inputs):
            TimetableJob.objects.filter(pk=job.pk).update(status='failed', error='Planning timed out.')
            return [dict(course_id=str(self.course.pk), title='Sorting')]
        with patch('apps.dashboard.tasks.plan_sessions', side_effect=cancel_and_plan):
            generate_timetable(str(job.pk))
        job.refresh_from_db()
        self.assertEqual(job.status, 'failed')
        self.assertEqual(job.result, {})


    def test_transient_failure_is_bounded_and_backed_off(self):
        job = TimetableJob.objects.create(user=self.user, fingerprint='retry', inputs=self.inputs)
        with patch('apps.dashboard.tasks.plan_sessions', side_effect=TimeoutError()):
            generate_timetable(str(job.pk))
        job.refresh_from_db()
        self.assertEqual(job.status, 'queued')
        self.assertEqual(job.attempts, 1)
        self.assertIsNotNone(job.next_attempt_at)
        with patch('apps.dashboard.tasks.plan_sessions') as planner:
            generate_timetable(str(job.pk))
        planner.assert_not_called()


    def test_dispatch_recovers_unpublished_jobs(self):
        from datetime import timedelta
        from django.utils import timezone
        from apps.dashboard.tasks import dispatch_timetable_jobs
        job = TimetableJob.objects.create(user=self.user, fingerprint='outbox', inputs=self.inputs)
        TimetableJob.objects.filter(pk=job.pk).update(updated_at=timezone.now() - timedelta(minutes=1))
        with patch('apps.dashboard.tasks.generate_timetable.delay') as enqueue:
            dispatch_timetable_jobs()
        enqueue.assert_called_once_with(str(job.pk))


    def test_old_run_cannot_overwrite_new_run(self):
        from uuid import uuid4
        job = TimetableJob.objects.create(user=self.user, fingerprint='lease', inputs=self.inputs)
        def replace_run(inputs):
            TimetableJob.objects.filter(pk=job.pk).update(run_token=uuid4())
            raise RuntimeError('old run failed')
        with patch('apps.dashboard.tasks.plan_sessions', side_effect=replace_run):
            generate_timetable(str(job.pk))
        job.refresh_from_db()
        self.assertEqual(job.status, 'processing')
        self.assertEqual(job.error, '')
