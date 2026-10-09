"""Research opt-in validation and prompt evidence formatting tests."""
from unittest.mock import patch
from django.test import SimpleTestCase
from apps.classroom.serializers import AskRequestSerializer


class ResearchContextTests(SimpleTestCase):

    def test_research_is_explicit_and_validated(self):
        request = AskRequestSerializer(data={'question': 'Explain momentum'})
        self.assertTrue(request.is_valid())
        self.assertFalse(request.validated_data['research'])
        invalid = AskRequestSerializer(data={'question': 'Explain momentum', 'research': 'nonsense'})
        self.assertFalse(invalid.is_valid())


    @patch('apps.classroom.services.research_context.research_evidence', side_effect=RuntimeError('secret'))
    def test_optional_research_failure_produces_safe_context(self, research):
        from apps.classroom.services.research_context import build_research_context
        context, metadata = build_research_context('Momentum')
        self.assertEqual(metadata['research_status'], 'unavailable')
        self.assertEqual(metadata['sources'], [])
        self.assertNotIn('secret', context)


    @patch('apps.classroom.services.research_context.research_evidence')
    def test_context_numbers_sources_without_altering_evidence(self, research):
        from apps.classroom.services.research_context import build_research_context
        item = {'title': 'Source', 'url': 'https://example.org', 'excerpt': 'Evidence', 'provider': 'tavily'}
        research.return_value = {'evidence': [item], 'errors': []}
        context, metadata = build_research_context('Momentum')
        self.assertEqual(metadata['sources'][0]['number'], 1)
        self.assertNotIn('number', item)
        self.assertIn('Evidence', context)
