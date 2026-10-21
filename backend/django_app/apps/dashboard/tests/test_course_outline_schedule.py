"""Focused regression coverage; shared setup lives in the fixture module."""
from unittest.mock import MagicMock, patch
from django.test import TestCase
from apps.dashboard.models import TimetableJob, SavedTimetable
from apps.dashboard.services.timetable_planner import plan_sessions
from apps.dashboard.services.timetable_scheduler import schedule_sessions
from .course_outline_fixtures import CourseOutlineFixture


class CourseOutlineScheduleTests(CourseOutlineFixture, TestCase):
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


    def test_nested_topics_exercises_persist_and_follow_real_timetable(self):
        detail = {'title': 'Foundations', 'subtopics': ['Life cycles', 'Requirements'], 'exercises': ['Compare two life cycles using a small project.']}
        response = self.client.put(self.url, {'topics': ['Foundations'], 'details': [detail], 'source': 'manual'}, format='json')
        self.assertEqual(response.status_code, 200)
        self.course.refresh_from_db()
        self.assertEqual(self.course.outline_details, [detail])
        inputs = dict(courses=[dict(id=self.course.pk, title=self.course.title, outline_topics=['Foundations'], outline_details=[detail])], preferences=self.preferences)
        schedule = schedule_sessions(inputs, plan_sessions(inputs))['schedule']
        self.assertEqual(schedule[0]['subtopics'], detail['subtopics'])
        self.assertEqual(schedule[0]['exercises'], detail['exercises'])
        SavedTimetable.objects.create(user=self.user, schedule=schedule)
        read = self.client.get(self.url)
        self.assertEqual(read.data['details'], [detail])
        self.assertEqual(read.data['sessions'][0]['day'], 'Monday')
        self.assertEqual(read.data['sessions'][0]['start'], '09:00')
        self.assertRegex(read.data['sessions'][0]['date'], r'^\d{4}-\d{2}-\d{2}$')


    def test_detail_changes_invalidate_old_timetable_proposal(self):
        topics = ['Foundations']
        self.client.put(self.url, {'topics': topics, 'source': 'manual', 'details': [{'title': topics[0], 'subtopics': ['Old concept'], 'exercises': []}]}, format='json')
        with patch('apps.dashboard.services.timetable_request_service.generate_timetable.delay'):
            result = self.client.post('/api/dashboard/timetable/generate/', self.preferences, format='json')
        job = TimetableJob.objects.get(pk=result.data['id'])
        job.status = 'ready'
        job.result = {'schedule': [{'courseId': str(self.course.pk)}]}
        job.save()
        self.client.put(self.url, {'topics': topics, 'source': 'manual', 'details': [{'title': topics[0], 'subtopics': ['New concept'], 'exercises': []}]}, format='json')
        self.assertEqual(self.client.post(f'/api/dashboard/timetable/jobs/{job.pk}/').status_code, 409)


    def test_session_join_includes_saved_subtopics_and_practice(self):
        from uuid import uuid4
        from datetime import datetime, timezone as tz
        session_id = str(uuid4())
        SavedTimetable.objects.create(user=self.user, schedule=[dict(id=session_id, title='Foundations', subject='Algorithms', dayOfWeek='Monday', startTime='09:00', endTime='10:00', timezone='UTC', subtopics=['Requirements'], exercises=['Interview a stakeholder.'])])
        with patch('apps.dashboard.services.session_join_service.timezone.now', return_value=datetime(2026, 10, 12, 9, 0, tzinfo=tz.utc)):
            response = self.client.post(f'/api/dashboard/timetable/sessions/{session_id}/join/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Requirements', response.data['lessonTopic'])
        self.assertIn('Interview a stakeholder.', response.data['lessonTopic'])
