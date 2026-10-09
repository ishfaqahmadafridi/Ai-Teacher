from unittest.mock import patch
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.core.cache import cache
from rest_framework.test import APIClient
from apps.dashboard.models import CourseModel, TimetableJob, SavedTimetable
from apps.dashboard.tasks import generate_timetable
from apps.dashboard.services.timetable_scheduler import schedule_sessions

class TimetableTests(TestCase):
    def setUp(self):
        cache.clear()
        self.user = get_user_model().objects.create_user(username='planner', email='planner@example.com')
        self.client = APIClient()
        self.client.force_authenticate(self.user)
        self.preferences = dict(start_time='09:00', end_time='12:30', days=['Monday', 'Tuesday'], max_classes=2, session_minutes=90, break_minutes=30, timezone='Asia/Karachi')
        self.course = CourseModel.objects.create(user=self.user, title='Algorithms', course_code='CS', subject_field='Computer Science')
        self.inputs = dict(courses=[dict(id=self.course.pk, title=self.course.title)], preferences=self.preferences)

    def test_generation_deduplicates_and_queues_after_commit(self):
        with patch('apps.dashboard.services.timetable_request_service.generate_timetable.delay') as enqueue:
            with self.captureOnCommitCallbacks(execute=True):
                first = self.client.post('/api/dashboard/timetable/generate/', self.preferences, format='json')
            second = self.client.post('/api/dashboard/timetable/generate/', self.preferences, format='json')
        self.assertEqual(first.status_code, 202)
        self.assertEqual(first.data['id'], second.data['id'])
        enqueue.assert_called_once()

    def test_rejects_invalid_hours_and_missing_courses(self):
        response = self.client.post('/api/dashboard/timetable/generate/', {**self.preferences, 'end_time':'09:30'}, format='json')
        self.assertEqual(response.status_code, 400)
        self.course.delete()
        self.assertEqual(self.client.post('/api/dashboard/timetable/generate/', self.preferences, format='json').status_code, 400)

    def test_worker_results_are_persisted_only_after_acceptance(self):
        job = TimetableJob.objects.create(user=self.user, fingerprint='test', inputs=self.inputs)
        with patch('apps.dashboard.tasks.plan_sessions', return_value=[dict(course_id=str(self.course.pk), title='Sorting')]):
            generate_timetable(str(job.pk))
        job.refresh_from_db()
        self.assertEqual(job.status, 'ready')
        self.assertFalse(SavedTimetable.objects.exists())
        response = self.client.post(f'/api/dashboard/timetable/jobs/{job.pk}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.client.get('/api/dashboard/timetable/').data['schedule'][0]['id'], job.result['schedule'][0]['id'])
        other = get_user_model().objects.create_user(username='other-planner')
        self.client.force_authenticate(other)
        self.assertEqual(self.client.get(f'/api/dashboard/timetable/jobs/{job.pk}/').status_code, 404)
        self.assertEqual(self.client.post(f'/api/dashboard/timetable/jobs/{job.pk}/').status_code, 404)
        self.assertEqual(self.client.get('/api/dashboard/timetable/').data['schedule'], [])

    def test_scheduler_rejects_overflow_and_foreign_courses(self):
        sessions = [dict(course_id=str(self.course.pk), title='Sorting')] * 4
        result = schedule_sessions(self.inputs, sessions)
        self.assertEqual(len(result['schedule']), 4)
        self.assertEqual(result['schedule'][1]['startTime'], '09:00')
        with self.assertRaises(ValueError):
            schedule_sessions(self.inputs, sessions * 2)
        with self.assertRaises(ValueError):
            schedule_sessions(self.inputs, [dict(course_id='unknown', title='Fake')])

    def test_provider_failure_does_not_save_schedule(self):
        job = TimetableJob.objects.create(user=self.user, fingerprint='fail', inputs=self.inputs)
        with patch('apps.dashboard.tasks.plan_sessions', side_effect=RuntimeError('unavailable')):
            generate_timetable(str(job.pk))
        job.refresh_from_db()
        self.assertEqual(job.status, 'failed')
        self.assertFalse(SavedTimetable.objects.exists())

    def test_broker_failure_is_visible(self):
        with patch('apps.dashboard.services.timetable_request_service.generate_timetable.delay', side_effect=RuntimeError('unavailable')):
            with self.captureOnCommitCallbacks(execute=True):
                response = self.client.post('/api/dashboard/timetable/generate/', self.preferences, format='json')
        self.assertEqual(self.client.get(f"/api/dashboard/timetable/jobs/{response.data['id']}/").data['status'], 'queued')

    def test_manual_slots_persist_and_reject_conflicts(self):
        from uuid import uuid4
        item = dict(id=str(uuid4()), title="Sorting", subject=self.course.title, dayOfWeek="Monday", timeSlot="09:00 AM - 10:30 AM", instructorName="AI Teacher", roomOrLink="", status="upcoming")
        self.assertEqual(self.client.post('/api/dashboard/timetable/', item, format='json').status_code, 201)
        item['id'] = str(uuid4())
        self.assertEqual(self.client.post('/api/dashboard/timetable/', item, format='json').status_code, 400)
        self.assertEqual(len(self.client.get('/api/dashboard/timetable/').data['schedule']), 1)

    def test_manual_slot_cannot_reference_foreign_course(self):
        from uuid import uuid4
        item = dict(id=str(uuid4()), title="Sorting", subject="Not registered", dayOfWeek="Monday", timeSlot="09:00 - 10:30", instructorName="", roomOrLink="", status="upcoming")
        self.assertEqual(self.client.post('/api/dashboard/timetable/', item, format='json').status_code, 400)
        self.assertFalse(SavedTimetable.objects.exists())

    def test_planner_accepts_dynamic_schema_and_restricts_course_ids(self):
        from apps.dashboard.services.timetable_planner import plan_sessions
        from unittest.mock import MagicMock
        llm = MagicMock()
        def structured(schema):
            with self.assertRaises(ValueError):
                schema.model_validate({"sessions": [{"course_id": "foreign", "title": "Fake"}]})
            chain = MagicMock()
            chain.invoke.return_value = schema.model_validate({"sessions": [{"course_id": str(self.course.pk), "title": "Sorting"}] * 4})
            return chain
        llm.with_structured_output.side_effect = structured
        with patch('apps.dashboard.services.timetable_planner.get_llm', return_value=llm):
            self.assertEqual(plan_sessions(self.inputs)[0]['course_id'], str(self.course.pk))

    def test_full_week_spreads_sessions_across_selected_days(self):
        preferences = {**self.preferences, "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]}
        inputs = {**self.inputs, "preferences": preferences}
        sessions = [dict(course_id=str(self.course.pk), title=f"Lesson {index}") for index in range(12)]
        result = schedule_sessions(inputs, sessions)
        counts = {day: sum(item['dayOfWeek'] == day for item in result['schedule']) for day in preferences['days']}
        self.assertTrue(all(count == 2 for count in counts.values()))
        self.assertEqual(len({(item['dayOfWeek'], item['startTime']) for item in result['schedule']}), 12)

    def test_daily_class_count_is_not_silently_reduced(self):
        from apps.dashboard.serializers.timetable_serializers import TimetablePreferencesSerializer
        serializer = TimetablePreferencesSerializer(data={**self.preferences, 'max_classes': 3})
        self.assertFalse(serializer.is_valid())
        self.assertIn('fit only 2', str(serializer.errors))
        serializer = TimetablePreferencesSerializer(data={**self.preferences, 'max_classes': 3, 'end_time': '14:30'})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        inputs = {**self.inputs, 'preferences': {**self.preferences, 'max_classes': 3, 'end_time':'14:30'}}
        sessions = [dict(course_id=str(self.course.pk), title=f'Lesson {i}') for i in range(6)]
        result = schedule_sessions(inputs, sessions)
        self.assertTrue(all(sum(item['dayOfWeek']==day for item in result['schedule'])==3 for day in self.preferences['days']))

    def test_preferences_reject_seconds_instead_of_truncating(self):
        from apps.dashboard.serializers.timetable_serializers import TimetablePreferencesSerializer
        serializer = TimetablePreferencesSerializer(data={**self.preferences, 'start_time': '09:00:30'})
        self.assertFalse(serializer.is_valid())
        self.assertIn('whole minutes', str(serializer.errors))

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

    def test_join_is_time_checked_and_attendance_persists_per_occurrence(self):
        from uuid import uuid4
        from datetime import datetime, timezone as tz
        from apps.dashboard.models import SessionAttendance
        session_id = str(uuid4())
        item = dict(id=session_id, title='Sorting', dayOfWeek='Monday', startTime='09:00', endTime='10:30', timezone='Asia/Karachi', status='upcoming', activeFrom='2026-10-11T00:00:00+00:00')
        SavedTimetable.objects.create(user=self.user, schedule=[item])
        route = f'/api/dashboard/timetable/sessions/{session_id}/join/'
        at = lambda hour, minute=0: datetime(2026, 10, 12, hour, minute, tzinfo=tz.utc)
        with patch('apps.dashboard.services.session_join_service.timezone.now', return_value=at(3, 59)):
            self.assertEqual(self.client.post(route).status_code, 409)
        with patch('apps.dashboard.services.session_join_service.timezone.now', return_value=at(4)):
            self.assertEqual(self.client.post(route).status_code, 200)
            self.assertEqual(self.client.post(route).status_code, 200)
        self.assertEqual(SessionAttendance.objects.count(), 1)
        with patch('apps.dashboard.services.session_join_service.timezone.now', return_value=at(5, 30)):
            self.assertEqual(self.client.post(route).status_code, 409)
        saved = SavedTimetable.objects.get(user=self.user)
        from apps.dashboard.services.session_attendance import schedule_with_attendance
        self.assertEqual(schedule_with_attendance(saved, self.user, at(6))[0]['attendance'], 'attended')
        following_monday = datetime(2026, 10, 19, 6, tzinfo=tz.utc)
        from apps.dashboard.services.attendance_reconciliation import reconcile_timetable
        reconcile_timetable(saved.pk, following_monday)
        self.assertEqual(schedule_with_attendance(saved, self.user, following_monday)[0]['attendance'], 'missed')
        missed = SessionAttendance.objects.get(user=self.user, session_id=session_id, session_date=following_monday.date())
        self.assertEqual(missed.status, 'missed')
        self.assertIsNone(missed.joined_at)
        schedule_with_attendance(saved, self.user, following_monday)
        self.assertEqual(SessionAttendance.objects.count(), 2)
        other = get_user_model().objects.create_user(username='attendance-other')
        self.client.force_authenticate(other)
        self.assertEqual(self.client.post(route).status_code, 404)

    def test_sessions_before_registration_are_not_marked_missed(self):
        from uuid import uuid4
        from datetime import datetime, timezone as tz
        from apps.dashboard.services.session_attendance import schedule_with_attendance
        item = dict(id=str(uuid4()), dayOfWeek='Monday', startTime='09:00', endTime='10:30', timezone='UTC', activeFrom='2026-10-13T00:00:00+00:00')
        saved = SavedTimetable.objects.create(user=self.user, schedule=[item])
        self.assertEqual(schedule_with_attendance(saved, self.user, datetime(2026, 10, 14, tzinfo=tz.utc))[0]['attendance'], 'unmarked')

    def test_reads_preserve_explicit_timezone_and_do_not_write_attendance(self):
        from uuid import uuid4
        from datetime import datetime, timezone as tz
        from apps.dashboard.services.session_attendance import schedule_with_attendance
        from apps.dashboard.models import SessionAttendance
        self.user.country, self.user.timezone = 'Pakistan', 'America/New_York'
        self.user.save()
        item = dict(id=str(uuid4()), dayOfWeek='Thursday', startTime='11:00', endTime='12:30', timezone='America/New_York', activeFrom='2026-10-01T00:00:00+00:00')
        saved = SavedTimetable.objects.create(user=self.user, schedule=[item])
        result = schedule_with_attendance(saved, self.user, datetime(2026, 10, 8, 14, 22, tzinfo=tz.utc))[0]
        self.assertEqual(result['timezone'], 'America/New_York')
        self.assertFalse(result['sessionEnded'])
        self.assertEqual(SessionAttendance.objects.count(), 0)
        self.user.refresh_from_db()
        self.assertEqual(self.user.timezone, 'America/New_York')

    def test_background_backfill_and_report_survive_replacement(self):
        from uuid import uuid4
        from datetime import datetime, timezone as tz
        from apps.dashboard.models import SessionAttendance, SessionOccurrence
        from apps.dashboard.services.attendance_reconciliation import reconcile_timetable
        item = dict(id=str(uuid4()), title='Sorting', subject='Algorithms', dayOfWeek='Monday', startTime='09:00', endTime='10:00', timezone='Asia/Karachi', activeFrom='2026-10-01T00:00:00+00:00')
        saved = SavedTimetable.objects.create(user=self.user, schedule=[item])
        now = datetime(2026, 10, 20, tzinfo=tz.utc)
        reconcile_timetable(saved.pk, now)
        reconcile_timetable(saved.pk, now)
        self.assertEqual(SessionAttendance.objects.count(), 3)
        self.assertEqual(SessionOccurrence.objects.count(), 3)
        saved.schedule = []
        saved.save()
        with patch('apps.dashboard.services.attendance_report_service.timezone.now', return_value=now):
            response = self.client.get('/api/dashboard/attendance/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['attendanceLogs']), 3)
        self.assertEqual(response.data['attendanceLogs'][0]['status'], 'absent')
        other = get_user_model().objects.create_user(username='report-other')
        self.client.force_authenticate(other)
        self.assertEqual(self.client.get('/api/dashboard/attendance/').data['attendanceLogs'], [])

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

    def test_report_export_escapes_formulas_and_counts_completed_classes(self):
        from uuid import uuid4
        from datetime import datetime, timedelta, timezone as tz
        from apps.dashboard.models import SessionAttendance, SessionOccurrence
        now = datetime.now(tz.utc)
        session_id = uuid4()
        SessionOccurrence.objects.create(user=self.user, session_id=session_id, session_date=now.date(), starts_at=now-timedelta(hours=2), ends_at=now-timedelta(hours=1), timezone='UTC', title='=1+1', subject='Algorithms')
        SessionAttendance.objects.create(user=self.user, session_id=session_id, session_date=now.date(), status='attended', joined_at=now-timedelta(hours=2))
        report = self.client.get('/api/dashboard/attendance/').data
        self.assertEqual(report['summary'], dict(total=1, attended=1, missed=0, rate=100))
        export = self.client.get('/api/dashboard/attendance/export/')
        csv = b''.join(export.streaming_content).decode()
        self.assertIn("'=1+1", csv)

    def test_empty_report_has_no_invented_percentage(self):
        self.assertEqual(self.client.get('/api/dashboard/attendance/').data['summary']['rate'], None)

    def test_background_worker_skips_timetables_until_the_next_class_ends(self):
        from datetime import timedelta
        from django.utils import timezone
        from apps.dashboard.tasks import reconcile_attendance
        SavedTimetable.objects.create(user=self.user, schedule=[{'id': 'unused'}], next_reconciliation_at=timezone.now() + timedelta(hours=1))
        with patch('apps.dashboard.services.attendance_reconciliation.reconcile_timetable') as reconcile:
            reconcile_attendance()
        reconcile.assert_not_called()

    def test_manual_slot_cannot_reuse_a_session_identifier(self):
        from uuid import uuid4
        item = dict(id=str(uuid4()), title='Sorting', subject=self.course.title, dayOfWeek='Monday', timeSlot='09:00 AM - 10:30 AM', instructorName='AI Teacher', roomOrLink='', status='upcoming')
        self.assertEqual(self.client.post('/api/dashboard/timetable/', item, format='json').status_code, 201)
        item['dayOfWeek'] = 'Tuesday'
        self.assertEqual(self.client.post('/api/dashboard/timetable/', item, format='json').status_code, 400)

    def test_summary_and_recent_missed_are_not_limited_by_history_page(self):
        from uuid import uuid4
        from datetime import timedelta
        from django.utils import timezone
        from django.test import override_settings
        from apps.dashboard.models import SessionAttendance, SessionOccurrence
        now = timezone.now()
        occurrences, records = [], []
        for index in range(5):
            start = now - timedelta(days=index+1)
            session_id = uuid4()
            occurrences.append(SessionOccurrence(user=self.user, session_id=session_id, session_date=start.date(), starts_at=start, ends_at=start+timedelta(hours=1), timezone='UTC', title='Saved lesson', subject='Algorithms'))
            records.append(SessionAttendance(user=self.user, session_id=session_id, session_date=start.date(), status='attended' if index<2 else 'missed'))
        SessionOccurrence.objects.bulk_create(occurrences)
        SessionAttendance.objects.bulk_create(records)
        with override_settings(ATTENDANCE_HISTORY_PAGE_SIZE=2):
            report = self.client.get('/api/dashboard/attendance/').data
        self.assertEqual(len(report['attendanceLogs']), 2)
        self.assertEqual(len(report['recentMissed']), 3)
        self.assertEqual(report['summary'], dict(total=5, attended=2, missed=3, rate=40))
