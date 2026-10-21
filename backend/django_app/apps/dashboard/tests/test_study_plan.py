"""Finite study plans cover curriculum and retain actual calendar dates."""
from datetime import date, datetime, timezone
from unittest.mock import patch
from django.test import TestCase
from apps.dashboard.models import SavedTimetable, SessionAttendance, TimetableJob
from apps.dashboard.services.study_plan_calendar import study_plan_dates
from apps.dashboard.services.study_plan_curriculum import plan_dated_sessions
from apps.dashboard.services.timetable_scheduler import schedule_sessions
from apps.dashboard.services.session_attendance import session_window
from apps.dashboard.services.attendance_reconciliation import reconcile_timetable
from apps.dashboard.tasks import generate_timetable
from .timetable_fixtures import TimetableFixture


class StudyPlanTests(TimetableFixture, TestCase):
    def setUp(self):
        super().setUp()
        self.preferences.update(start_date='2030-01-31', duration_months=2)
        self.inputs['courses'][0].update(outline_topics=['Foundations', 'Testing'], outline_details=[
            dict(title='Foundations', subtopics=['Requirements', 'Design'], exercises=['Build a model', 'Review it']),
            dict(title='Testing', subtopics=['Unit tests'], exercises=['Write a test']),
        ])

    def test_calendar_months_and_leap_day(self):
        self.assertEqual(study_plan_dates(self.preferences), (date(2030, 1, 31), date(2030, 3, 31)))
        self.assertEqual(study_plan_dates(dict(start_date='2023-11-30', duration_months=3))[1], date(2024, 2, 29))

    def test_topics_and_practice_are_finite_and_dated(self):
        units = plan_dated_sessions(self.inputs)
        self.assertEqual(len(units), 6)
        self.assertEqual([part for unit in units if unit['sessionKind'] == 'lesson' for part in unit['subtopics']], ['Requirements', 'Design', 'Unit tests'])
        self.assertEqual([part for unit in units for part in unit['exercises']], ['Build a model', 'Review it', 'Write a test'])
        items = schedule_sessions(self.inputs, units)['schedule']
        self.assertEqual(len(items), len(units))
        dates = [item['sessionDate'] for item in items]
        self.assertEqual(dates, sorted(dates))
        for item in items:
            self.assertLess(item['sessionDate'], '2030-03-31')
            self.assertGreaterEqual(item['sessionDate'], '2030-01-31')
            self.assertIn(item['dayOfWeek'], self.preferences['days'])
            self.assertEqual(item['weekNumber'], (date.fromisoformat(item['sessionDate']) - date(2030, 1, 31)).days // 7 + 1)
        self.assertGreater(items[-1]['weekNumber'], 7)

    def test_compact_plan_covers_exercises_and_rejects_overflow(self):
        with patch('apps.dashboard.services.study_plan_curriculum.dated_slots', return_value=[None] * 4):
            units = plan_dated_sessions(self.inputs)
        self.assertEqual(len(units), 4)
        self.assertEqual(sum(len(unit['exercises']) for unit in units), 3)
        with patch('apps.dashboard.services.study_plan_curriculum.dated_slots', return_value=[None] * 3):
            with self.assertRaisesMessage(ValueError, 'cannot cover every topic'):
                plan_dated_sessions(self.inputs)

    def test_request_requires_outline_and_valid_period(self):
        self.assertEqual(self.client.post('/api/dashboard/timetable/generate/', self.preferences, format='json').status_code, 400)
        for values in [dict(start_date='2000-01-01'), dict(duration_months=1), dict(duration_months=None)]:
            self.assertEqual(self.client.post('/api/dashboard/timetable/generate/', {**self.preferences, **values}, format='json').status_code, 400)

    def test_worker_acceptance_preserves_dates_and_curriculum(self):
        self.course.outline_topics = self.inputs['courses'][0]['outline_topics']
        self.course.outline_details = self.inputs['courses'][0]['outline_details']
        self.course.save()
        job = TimetableJob.objects.create(user=self.user, fingerprint='dated', inputs=self.inputs)
        with patch('apps.dashboard.services.timetable_planner.get_llm', side_effect=AssertionError('No provider needed')):
            generate_timetable(str(job.pk))
        job.refresh_from_db()
        self.assertEqual(job.status, 'ready', job.error)
        self.assertEqual(self.client.post(f'/api/dashboard/timetable/jobs/{job.pk}/').status_code, 200)
        result = self.client.get('/api/dashboard/timetable/').data['schedule']
        self.assertEqual(result[0]['sessionDate'], job.result['schedule'][0]['sessionDate'])
        self.assertEqual(result[0]['subtopics'], ['Requirements'])

    def test_past_dated_class_never_rolls_or_reconciles_twice(self):
        item = schedule_sessions(self.inputs, plan_dated_sessions(self.inputs))['schedule'][0]
        saved = SavedTimetable.objects.create(user=self.user, schedule=[item])
        later = datetime(2031, 1, 1, tzinfo=timezone.utc)
        start, _ = session_window(item, self.user.timezone, later)
        self.assertEqual(start.date().isoformat(), item['sessionDate'])
        reconcile_timetable(saved.pk, later)
        reconcile_timetable(saved.pk, later)
        self.assertEqual(SessionAttendance.objects.filter(user=self.user).count(), 1)
        saved.refresh_from_db()
        self.assertIsNone(saved.next_reconciliation_at)

    def test_valid_request_queues_serializable_dates_and_saved_curriculum(self):
        self.course.outline_topics = self.inputs['courses'][0]['outline_topics']
        self.course.outline_details = self.inputs['courses'][0]['outline_details']
        self.course.save()
        with patch('apps.dashboard.services.timetable_request_service.generate_timetable.delay') as enqueue:
            with self.captureOnCommitCallbacks(execute=True):
                response = self.client.post('/api/dashboard/timetable/generate/', self.preferences, format='json')
        self.assertEqual(response.status_code, 202)
        enqueue.assert_called_once()
        job = TimetableJob.objects.get(pk=response.data['id'])
        self.assertEqual(job.inputs['preferences']['start_date'], '2030-01-31')
        self.assertEqual(job.inputs['courses'][0]['outline_details'][0]['subtopics'], ['Requirements', 'Design'])
