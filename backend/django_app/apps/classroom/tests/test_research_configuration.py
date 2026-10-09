"""Research request budget validation tests, isolated from graph execution."""
from unittest.mock import patch
from django.test import SimpleTestCase
from django.core.exceptions import ImproperlyConfigured


class ResearchConfigurationTests(SimpleTestCase):

    def test_research_budgets_reject_invalid_and_unbounded_values(self):
        from apps.classroom.constants.research import research_budget
        for value in ('0', '-1', 'nan', 'inf', '31', 'secret-invalid-value'):
            with self.subTest(value=value), patch.dict('os.environ', {'RESEARCH_TEST_BUDGET': value}):
                with self.assertRaises(ImproperlyConfigured) as error:
                    research_budget('RESEARCH_TEST_BUDGET', 8, maximum=30, integer=False)
                self.assertNotIn('secret-invalid-value', str(error.exception))


    def test_research_budget_accepts_default_and_configured_values(self):
        from apps.classroom.constants.research import research_budget
        with patch.dict('os.environ', {}, clear=True):
            self.assertEqual(research_budget('RESEARCH_TEST_BUDGET', 3, maximum=10), 3)
        with patch.dict('os.environ', {'RESEARCH_TEST_BUDGET': '2.5'}):
            self.assertEqual(research_budget('RESEARCH_TEST_BUDGET', 8, maximum=30, integer=False), 2.5)
