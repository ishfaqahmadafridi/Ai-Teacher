"""Class times follow saved course plans without generating a new curriculum."""
from collections import Counter
from datetime import date
from unittest.mock import patch
from django.test import TestCase
from apps.dashboard.models import CourseModel, TimetableJob
from apps.dashboard.services.saved_plan_timetable import plan_saved_course_sessions
from apps.dashboard.services.timetable_scheduler import schedule_sessions
from apps.dashboard.tasks import generate_timetable
from .course_outline_fixtures import CourseOutlineFixture


class SavedPlanTimetableTests(CourseOutlineFixture, TestCase):
    def setUp(self):
        super().setUp()
        self.course.outline_topics = ['Foundations', 'Design']
        self.course.outline_details = [dict(title='Foundations', subtopics=['Requirements', 'Modelling'], exercises=['Build a model'])]
        self.course.outline_period = dict(start_date='2030-01-01', duration_months=2)
        self.course.save()
        self.preferences.update(use_saved_plans=True, course_ids=[self.course.pk])
        self.inputs = dict(preferences=self.preferences, courses=[dict(id=self.course.pk, title=self.course.title,
            outline_topics=self.course.outline_topics, outline_details=self.course.outline_details, outline_period=self.course.outline_period)])

    def test_schedule_retains_saved_weeks_and_has_four_quiz_classes(self):
        units = plan_saved_course_sessions(self.inputs)
        result = schedule_sessions(self.inputs, units)['schedule']
        self.assertEqual([item['weekNumber'] for item in result if item['sessionKind'] == 'quiz'], [2, 4, 6, 9])
        self.assertEqual(result[0]['planStartDate'], '2030-01-01')
        self.assertEqual(result[-1]['planEndDate'], '2030-02-28')
        for item in result:
            self.assertIn(item['dayOfWeek'], self.preferences['days'])
            self.assertEqual(item['weekNumber'], (date.fromisoformat(item['sessionDate']) - date(2030, 1, 1)).days // 7 + 1)
        self.course.refresh_from_db()
        self.assertEqual(self.course.outline_period['duration_months'], 2)

    def test_selected_courses_are_owned_and_have_saved_plans(self):
        url = '/api/dashboard/timetable/generate/'
        foreign = CourseModel.objects.create(user=self.other, title='Foreign', course_code='F')
        self.assertEqual(self.client.post(url, {**self.preferences, 'course_ids': [foreign.pk]}, format='json').status_code, 400)
        self.course.outline_period = {}
        self.course.save()
        self.assertEqual(self.client.post(url, self.preferences, format='json').status_code, 400)
        with patch('apps.dashboard.services.timetable_request_service.generate_timetable.delay'):
            self.course.outline_period = self.inputs['courses'][0]['outline_period']
            self.course.save()
            response = self.client.post(url, self.preferences, format='json')
        self.assertEqual(response.status_code, 202, response.data)
        job = TimetableJob.objects.get(pk=response.data['id'])
        self.assertEqual([course['id'] for course in job.inputs['courses']], [self.course.pk])
        self.assertNotIn('duration_months', job.inputs['preferences'])

    def test_many_courses_do_not_overlap_or_exceed_daily_capacity(self):
        self.preferences['days'].append('Wednesday')
        self.inputs['courses'].append({**self.inputs['courses'][0], 'id': 999, 'title': 'Another course'})
        units = plan_saved_course_sessions(self.inputs)
        slots = [(item['sessionDate'], item['minute']) for item in units]
        self.assertEqual(len(slots), len(set(slots)))
        self.assertTrue(all(count <= self.preferences['max_classes'] for count in Counter(item['sessionDate'] for item in units).values()))

    def test_insufficient_availability_does_not_move_work_to_another_week(self):
        self.preferences.update(days=['Monday'], max_classes=1)
        with self.assertRaisesMessage(ValueError, 'cannot fit'):
            plan_saved_course_sessions(self.inputs)

    def test_worker_accepts_times_without_changing_saved_outline(self):
        job = TimetableJob.objects.create(user=self.user, fingerprint='saved-plan-times', inputs=self.inputs)
        with patch('apps.dashboard.services.timetable_planner.get_llm', side_effect=AssertionError('No new AI plan')):
            generate_timetable(str(job.pk))
        job.refresh_from_db()
        self.assertEqual(job.status, 'ready', job.error)
        self.assertEqual(self.client.post(f'/api/dashboard/timetable/jobs/{job.pk}/').status_code, 200)
        self.course.refresh_from_db()
        self.assertEqual(self.course.outline_topics, ['Foundations', 'Design'])
        self.course.outline_period['duration_months'] = 4
        self.course.save()
        self.assertEqual(self.client.post(f'/api/dashboard/timetable/jobs/{job.pk}/').status_code, 409)

    def test_started_preview_cannot_be_accepted_and_is_requeued_on_request(self):
        from datetime import datetime, timedelta
        from zoneinfo import ZoneInfo
        url = '/api/dashboard/timetable/generate/'
        with patch('apps.dashboard.services.timetable_request_service.generate_timetable.delay'):
            response = self.client.post(url, self.preferences, format='json')
        job = TimetableJob.objects.get(pk=response.data['id'])
        generate_timetable(str(job.pk))
        job.refresh_from_db()
        first = job.result['schedule'][0]
        later = datetime.fromisoformat(f"{first['sessionDate']}T{first['startTime']}").replace(tzinfo=ZoneInfo(first['timezone'])) + timedelta(minutes=1)
        with patch('django.utils.timezone.now', return_value=later), patch('apps.dashboard.services.timetable_request_service.generate_timetable.delay'):
            self.assertEqual(self.client.post(f'/api/dashboard/timetable/jobs/{job.pk}/').status_code, 409)
            recreated = self.client.post(url, self.preferences, format='json')
        self.assertEqual(recreated.status_code, 202, recreated.data)
        self.assertEqual(recreated.data['id'], str(job.pk))
        job.refresh_from_db()
        self.assertEqual(job.status, 'queued')
        self.assertEqual(job.result, {})

    def test_ended_plan_and_duplicate_course_selection_are_rejected(self):
        from datetime import datetime, timezone
        with patch('django.utils.timezone.now', return_value=datetime(2031, 1, 1, tzinfo=timezone.utc)):
            with self.assertRaisesMessage(ValueError, 'has ended'):
                plan_saved_course_sessions(self.inputs)
        response = self.client.post('/api/dashboard/timetable/generate/', {**self.preferences, 'course_ids': [self.course.pk, self.course.pk]}, format='json')
        self.assertEqual(response.status_code, 400)
