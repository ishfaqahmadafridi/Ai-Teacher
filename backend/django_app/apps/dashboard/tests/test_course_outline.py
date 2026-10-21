"""Course outline ownership, persistence, drafts, and scheduling contracts."""
from unittest.mock import MagicMock, patch
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import TestCase
from rest_framework.test import APIClient
from apps.dashboard.models import CourseModel, TimetableJob
from apps.dashboard.services.timetable_planner import plan_sessions
from apps.dashboard.services.timetable_scheduler import schedule_sessions


class CourseOutlineTests(TestCase):
    def setUp(self):
        cache.clear()
        self.user = get_user_model().objects.create_user(username='outline-owner', email='owner@example.invalid')
        self.other = get_user_model().objects.create_user(username='outline-other', email='other@example.invalid')
        self.client = APIClient()
        self.client.force_authenticate(self.user)
        self.course = CourseModel.objects.create(user=self.user, title='Algorithms', course_code='CS101', subject_field='Computer Science')
        self.url = f'/api/dashboard/courses/{self.course.pk}/outline/'
        self.preferences = dict(start_time='09:00', end_time='12:30', days=['Monday', 'Tuesday'], max_classes=2, session_minutes=90, break_minutes=30, timezone='Asia/Karachi')

    def test_manual_outline_persists_and_appears_in_course_list(self):
        self.assertEqual(self.client.get(self.url).data['topics'], [])
        response = self.client.put(self.url, {'topics': [' Foundations ', 'Sorting'], 'source': 'manual'}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['topics'], ['Foundations', 'Sorting'])
        self.assertIsNotNone(response.data['updated_at'])
        self.course.refresh_from_db()
        self.assertEqual(self.course.outline_source, 'manual')
        listed = self.client.get('/api/dashboard/courses/').data[0]
        self.assertEqual(listed['outline_topics'], ['Foundations', 'Sorting'])

    def test_invalid_outlines_do_not_overwrite_saved_topics(self):
        self.course.outline_topics = ['Keep this']
        self.course.save()
        for topics in [[], ['Sorting', 'sorting'], ['x' * 256], ['']]:
            response = self.client.put(self.url, {'topics': topics, 'source': 'manual'}, format='json')
            self.assertEqual(response.status_code, 400)
        self.course.refresh_from_db()
        self.assertEqual(self.course.outline_topics, ['Keep this'])

    def test_account_ownership_is_enforced_on_every_endpoint(self):
        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.get(self.url).status_code, 404)
        self.assertEqual(self.client.put(self.url, {'topics': ['Fake'], 'source': 'manual'}, format='json').status_code, 404)
        self.assertEqual(self.client.post(self.url + 'generate/').status_code, 404)
        self.client.force_authenticate(None)
        self.assertEqual(self.client.get(self.url).status_code, 401)

    def test_ai_generation_is_an_editable_draft_until_saved(self):
        llm = MagicMock()
        llm.with_structured_output.return_value.invoke.return_value = {'topics': ['Foundations', 'Sorting', 'Graphs']}
        with patch('apps.dashboard.services.course_outline_service.get_llm', return_value=llm):
            response = self.client.post(self.url + 'generate/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['source'], 'ai')
        self.course.refresh_from_db()
        self.assertEqual(self.course.outline_topics, [])
        saved = self.client.put(self.url, {'topics': ['Foundations', 'Sorting edited', 'Graphs'], 'source': 'ai'}, format='json')
        self.assertEqual(saved.status_code, 200)
        self.assertEqual(saved.data['topics'][1], 'Sorting edited')

    def test_provider_failure_does_not_save_fake_outline(self):
        with patch('apps.dashboard.services.course_outline_service.get_llm', return_value=None):
            self.assertEqual(self.client.post(self.url + 'generate/').status_code, 503)
        self.course.refresh_from_db()
        self.assertEqual(self.course.outline_topics, [])

    def test_saved_topics_determine_order_without_an_extra_ai_call(self):
        inputs = dict(courses=[dict(id=self.course.pk, title='Algorithms', outline_topics=['Foundations', 'Sorting', 'Graphs'])], preferences=self.preferences)
        with patch('apps.dashboard.services.timetable_planner.get_llm') as provider:
            sessions = plan_sessions(inputs)
        provider.assert_not_called()
        self.assertEqual([session['title'] for session in sessions], ['Foundations', 'Sorting', 'Graphs', 'Foundations'])
        schedule = schedule_sessions(inputs, sessions)['schedule']
        self.assertEqual([item['title'] for item in schedule], [session['title'] for session in sessions])

    def test_timetable_snapshot_includes_outline_and_rejects_stale_acceptance(self):
        self.course.outline_topics = ['Foundations', 'Sorting']
        self.course.save()
        with patch('apps.dashboard.services.timetable_request_service.generate_timetable.delay'):
            response = self.client.post('/api/dashboard/timetable/generate/', self.preferences, format='json')
        self.assertEqual(response.status_code, 202)
        job = TimetableJob.objects.get(pk=response.data['id'])
        self.assertEqual(job.inputs['courses'][0]['outline_topics'], ['Foundations', 'Sorting'])
        job.status = 'ready'
        job.result = {'schedule': [{'courseId': str(self.course.pk)}]}
        job.save()
        self.client.put(self.url, {'topics': ['Changed'], 'source': 'manual'}, format='json')
        response = self.client.post(f'/api/dashboard/timetable/jobs/{job.pk}/')
        self.assertEqual(response.status_code, 409)

    def test_mixed_ai_plan_cannot_override_the_saved_course_topics(self):
        inputs = dict(courses=[dict(id=self.course.pk, title='Algorithms', outline_topics=['Foundations', 'Graphs']),
            dict(id=999, title='Other course', outline_topics=[])], preferences=self.preferences)
        llm = MagicMock()
        llm.with_structured_output.return_value.invoke.return_value = {'sessions': [
            {'course_id': str(self.course.pk), 'title': 'AI replacement'},
            {'course_id': '999', 'title': 'Other foundation'},
            {'course_id': str(self.course.pk), 'title': 'Another replacement'},
            {'course_id': '999', 'title': 'Other application'},
        ]}
        with patch('apps.dashboard.services.timetable_planner.get_llm', return_value=llm):
            sessions = plan_sessions(inputs)
        self.assertEqual([item['title'] for item in sessions if item['course_id'] == str(self.course.pk)], ['Foundations', 'Graphs'])
