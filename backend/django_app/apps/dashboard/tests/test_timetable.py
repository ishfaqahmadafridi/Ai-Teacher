"""Focused regression coverage; shared setup lives in the fixture module."""
from unittest.mock import patch
from django.contrib.auth import get_user_model
from django.test import TestCase
from apps.dashboard.models import TimetableJob, SavedTimetable
from apps.dashboard.tasks import generate_timetable
from apps.dashboard.services.timetable_scheduler import schedule_sessions
from .timetable_fixtures import TimetableFixture


class TimetableTests(TimetableFixture, TestCase):
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


    def test_manual_slot_cannot_reuse_a_session_identifier(self):
        from uuid import uuid4
        item = dict(id=str(uuid4()), title='Sorting', subject=self.course.title, dayOfWeek='Monday', timeSlot='09:00 AM - 10:30 AM', instructorName='AI Teacher', roomOrLink='', status='upcoming')
        self.assertEqual(self.client.post('/api/dashboard/timetable/', item, format='json').status_code, 201)
        item['dayOfWeek'] = 'Tuesday'
        self.assertEqual(self.client.post('/api/dashboard/timetable/', item, format='json').status_code, 400)
