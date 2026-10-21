"""Focused regression coverage; shared setup lives in the fixture module."""
from unittest.mock import MagicMock, patch
from django.core.cache import cache
from django.test import TestCase
from .course_outline_fixtures import CourseOutlineFixture


class CourseOutlineGenerationTests(CourseOutlineFixture, TestCase):
    def test_ai_generation_is_an_editable_draft_until_saved(self):
        llm = MagicMock()
        llm.with_structured_output.return_value.invoke.return_value = {'topics': ['Foundations', 'Sorting', 'Graphs'], 'details': []}
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


    def test_ai_returns_editable_nested_details_without_saving(self):
        detail = {'title': 'Foundations', 'subtopics': ['Life cycles'], 'exercises': ['Compare two approaches.']}
        llm = MagicMock()
        llm.with_structured_output.return_value.invoke.return_value = {'topics': ['Foundations'], 'details': [detail]}
        with patch('apps.dashboard.services.course_outline_service.get_llm', return_value=llm):
            response = self.client.post(self.url + 'generate/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['details'], [detail])
        self.course.refresh_from_db()
        self.assertEqual(self.course.outline_details, [])


    def test_missing_student_level_is_rejected_before_provider_call(self):
        self.user.education_level = ''
        self.user.save()
        with patch('apps.dashboard.services.course_outline_service.get_llm') as provider:
            response = self.client.post(self.url + 'generate/')
        self.assertEqual(response.status_code, 400)
        self.assertIn('education level', str(response.data))
        provider.assert_not_called()


    def test_generation_uses_saved_student_level_and_grade_guidance(self):
        for level, expected in [('primary', 'very simple words'), ('middle', 'Middle school'), ('high_school', 'school-level foundations'), ('undergraduate', 'introductory degree-level'), ('postgraduate', 'graduate-level depth')]:
            with self.subTest(level=level):
                cache.clear()
                self.user.education_level = level
                self.user.academic_year = 'Year 2'
                self.user.grade_level = 'Grade 5'
                self.user.save()
                llm = MagicMock()
                llm.with_structured_output.return_value.invoke.return_value = {'topics': ['Foundations'], 'details': []}
                with patch('apps.dashboard.services.course_outline_service.get_llm', return_value=llm):
                    response = self.client.post(self.url + 'generate/')
                self.assertEqual(response.status_code, 200)
                messages = llm.with_structured_output.return_value.invoke.call_args.args[0]
                self.assertIn(expected, str(messages))
                self.assertIn(level, messages[1][1])
                self.assertIn('Grade 5', messages[1][1])
                self.assertIn('Year 2', messages[1][1])
                self.assertEqual(self.course.outline_topics, [])


    def test_provider_schema_is_simple_but_saved_draft_validation_remains_bounded(self):
        from apps.dashboard.serializers.course_outline_draft import OutlineDraft
        import json
        schema = json.dumps(OutlineDraft.model_json_schema())
        self.assertNotIn('maxItems', schema)
        self.assertNotIn('maxLength', schema)
        llm = MagicMock()
        llm.with_structured_output.return_value.invoke.return_value = {'topics': ['x' * 256], 'details': []}
        with patch('apps.dashboard.services.course_outline_service.get_llm', return_value=llm):
            response = self.client.post(self.url + 'generate/')
        self.assertEqual(response.status_code, 503)
        self.course.refresh_from_db()
        self.assertEqual(self.course.outline_topics, [])
