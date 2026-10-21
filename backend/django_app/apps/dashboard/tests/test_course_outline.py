"""Focused regression coverage; shared setup lives in the fixture module."""
from django.test import TestCase
from .course_outline_fixtures import CourseOutlineFixture


class CourseOutlineTests(CourseOutlineFixture, TestCase):
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


    def test_details_cannot_reference_another_topic_or_duplicate_topic(self):
        for details in [
            [{'title': 'Missing', 'subtopics': [], 'exercises': []}],
            [{'title': 'Foundations'}, {'title': 'Foundations'}],
        ]:
            result = self.client.put(self.url, {'topics': ['Foundations'], 'source': 'manual', 'details': details}, format='json')
            self.assertEqual(result.status_code, 400)
