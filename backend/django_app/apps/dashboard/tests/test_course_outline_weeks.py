"""Selected course duration produces a persisted, complete weekly curriculum."""
from datetime import date, timedelta
from unittest.mock import MagicMock, patch
from django.test import TestCase
from apps.dashboard.services.course_outline_plan import build_course_weeks
from .course_outline_fixtures import CourseOutlineFixture


class CourseOutlineWeeksTests(CourseOutlineFixture, TestCase):
    def setUp(self):
        super().setUp()
        self.period = dict(start_date='2030-01-01', duration_months=4)
        self.topics = ['Foundations', 'Design']
        self.details = [dict(title='Foundations', subtopics=['Requirements', 'Modelling'], exercises=['Write a specification']),
                        dict(title='Design', subtopics=['Interfaces'], exercises=['Build a prototype'])]

    def test_four_months_cover_all_weeks_and_curriculum(self):
        weeks = build_course_weeks(self.topics, self.details, self.period)
        self.assertEqual(len(weeks), 18)
        self.assertEqual(weeks[0]['start'], '2030-01-01')
        self.assertEqual(weeks[-1]['end'], '2030-04-30')
        for first, second in zip(weeks, weeks[1:]):
            self.assertEqual(date.fromisoformat(first['end']) + timedelta(days=1), date.fromisoformat(second['start']))
        items = [item for week in weeks for item in week['items'] if item['activity'] != 'Review']
        self.assertEqual([part for item in items for part in item['subtopics']], ['Requirements', 'Modelling', 'Interfaces'])
        self.assertEqual([part for item in items for part in item['exercises']], ['Write a specification', 'Build a prototype'])
        self.assertTrue(all(week['items'] for week in weeks))
        self.assertTrue(any(item['activity'] == 'Review' for week in weeks for item in week['items']))

    def test_two_months_repartition_without_losing_work(self):
        weeks = build_course_weeks(self.topics, self.details, {**self.period, 'duration_months': 2})
        self.assertEqual(len(weeks), 9)
        self.assertEqual(weeks[-1]['end'], '2030-02-28')
        self.assertEqual(build_course_weeks([], [], self.period), [])

    def test_dense_outline_preserves_topic_order(self):
        topics = [f'Topic {index}' for index in range(60)]
        weeks = build_course_weeks(topics, [], self.period)
        self.assertEqual([item['title'] for week in weeks for item in week['items']], topics)

    def test_save_and_reopen_retain_period_and_weeks(self):
        payload = dict(topics=self.topics, details=self.details, source='manual', period=self.period)
        response = self.client.put(self.url, payload, format='json')
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(len(response.data['weeks']), 18)
        reopened = self.client.get(self.url)
        self.assertEqual(reopened.data['weeks'], response.data['weeks'])
        self.assertEqual(reopened.data['period'], self.period)
        self.course.refresh_from_db()
        self.assertEqual(self.course.outline_period, self.period)
        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.get(self.url).status_code, 404)

    def test_period_is_validated_before_ai_invocation(self):
        with patch('apps.dashboard.services.course_outline_service.get_llm') as provider:
            response = self.client.post(self.url + 'generate/', {'period': {**self.period, 'duration_months': 12}}, format='json')
        self.assertEqual(response.status_code, 400)
        provider.assert_not_called()

    def test_draft_uses_duration_but_does_not_persist_until_saved(self):
        llm = MagicMock()
        llm.with_structured_output.return_value.invoke.return_value = dict(topics=self.topics, details=self.details)
        with patch('apps.dashboard.services.course_outline_service.get_llm', return_value=llm):
            response = self.client.post(self.url + 'generate/', {'period': self.period}, format='json')
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(len(response.data['weeks']), 18)
        prompt = llm.with_structured_output.return_value.invoke.call_args.args[0][1][1]
        self.assertIn('"duration_months": 4', prompt)
        self.course.refresh_from_db()
        self.assertEqual(self.course.outline_period, {})
        self.assertEqual(self.course.outline_topics, [])

    def test_review_never_introduces_future_subtopics(self):
        weeks = build_course_weeks(self.topics, self.details, self.period)
        taught = set()
        for week in weeks:
            for item in week['items']:
                scope = set(item['subtopics'] + item['exercises'])
                if item['activity'] == 'Review':
                    self.assertTrue(scope.issubset(taught))
                else:
                    taught.update(scope)

    def test_nine_week_plan_has_four_quizzes_and_assignments_after_exercises(self):
        weeks = build_course_weeks(self.topics, self.details, {**self.period, 'duration_months': 2})
        self.assertEqual([week['number'] for week in weeks if week['quiz']], [2, 4, 6, 9])
        self.assertEqual([week['quiz']['number'] for week in weeks if week['quiz']], [1, 2, 3, 4])
        self.assertEqual(weeks[-1]['quiz']['topics'], self.topics)
        assignments = [assignment for week in weeks for item in week['items'] for assignment in item['assignments']]
        self.assertEqual([assignment['exercise'] for assignment in assignments], ['Write a specification', 'Build a prototype'])
        for assignment in assignments:
            self.assertIn(assignment['exercise'], assignment['instruction'])
        for week in weeks:
            introduced = {item['title'] for earlier in weeks[:week['number']] for item in earlier['items']}
            if week['quiz']:
                self.assertTrue(set(week['quiz']['topics']).issubset(introduced))

    def test_four_month_plan_still_contains_exactly_four_quizzes(self):
        weeks = build_course_weeks(self.topics, self.details, self.period)
        self.assertEqual([week['number'] for week in weeks if week['quiz']], [4, 9, 13, 18])
        saved = self.client.put(self.url, dict(topics=self.topics, details=self.details, source='manual', period=self.period), format='json')
        self.assertEqual(saved.status_code, 200)
        self.assertEqual(len([week for week in saved.data['weeks'] if week['quiz']]), 4)
        self.assertEqual(self.client.get(self.url).data['weeks'], saved.data['weeks'])
