"""Research workflow boundary, reuse and degradation tests."""
from unittest.mock import patch
from django.test import SimpleTestCase, override_settings
from django.core.cache import cache
from apps.classroom.agents.research import research_evidence
from apps.classroom.serializers import AskRequestSerializer


@override_settings(CACHES={'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'}})
class ResearchTests(SimpleTestCase):
    def setUp(self):
        cache.clear()

    @patch('apps.classroom.services.research_search.search_provider')
    def test_deduplicates_and_reuses_evidence(self, search):
        search.return_value = [{'title': 'Momentum', 'url': 'https://example.org/lesson',
                                'excerpt': 'Conservation', 'provider': 'tavily'}]
        result = research_evidence('Momentum')
        self.assertEqual(len(result['evidence']), 1)
        research_evidence('Momentum')
        self.assertEqual(search.call_count, 2)

    @patch('apps.classroom.services.research_search.search_provider')
    def test_failures_are_bounded_and_do_not_expose_secrets(self, search):
        search.side_effect = RuntimeError('secret-key-in-url')
        result = research_evidence('Momentum')
        self.assertEqual(result['evidence'], [])
        self.assertEqual(result['errors'], ['tavily', 'openalex'])
        self.assertNotIn('secret-key', str(result))
        self.assertEqual(search.call_count, 2)

    def test_research_is_explicit_and_validated(self):
        request = AskRequestSerializer(data={'question': 'Explain momentum'})
        self.assertTrue(request.is_valid())
        self.assertFalse(request.validated_data['research'])
        invalid = AskRequestSerializer(data={'question': 'Explain momentum', 'research': 'nonsense'})
        self.assertFalse(invalid.is_valid())

    @patch('apps.classroom.agents.research.graph.cache.get', side_effect=RuntimeError('cache offline'))
    @patch('apps.classroom.services.research_search.search_provider', return_value=[])
    def test_cache_outage_does_not_prevent_research(self, search, cache_get):
        self.assertEqual(research_evidence('Momentum')['evidence'], [])
        self.assertEqual(search.call_count, 2)

    @patch('apps.classroom.services.research_context.research_evidence', side_effect=RuntimeError('secret'))
    def test_optional_research_failure_produces_safe_context(self, research):
        from apps.classroom.services.research_context import build_research_context
        context, metadata = build_research_context('Momentum')
        self.assertEqual(metadata['research_status'], 'unavailable')
        self.assertEqual(metadata['sources'], [])
        self.assertNotIn('secret', context)

    @patch.dict('os.environ', {'TAVILY_API_KEY': 'test-only'})
    @patch('apps.classroom.services.research_search._request')
    def test_provider_filters_invalid_urls(self, request):
        from apps.classroom.services.research_search import search_provider
        request.return_value = {'results': [
            {'title': 'Valid', 'url': 'https://example.org/source', 'content': 'Evidence'},
            {'title': 'Invalid', 'url': 'javascript:alert(1)', 'content': 'Bad'},
            None,
        ]}
        results = search_provider('tavily', 'Momentum')
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['excerpt'], 'Evidence')

    @patch.dict('os.environ', {'OPENALEX_API_KEY': 'test-only'})
    @patch('apps.classroom.services.research_search._request')
    def test_paper_metadata_is_not_fabricated_as_excerpt(self, request):
        from apps.classroom.services.research_search import search_provider
        request.return_value = {'results': [{'display_name': 'Study', 'doi': 'https://doi.org/10.1/example'}]}
        results = search_provider('openalex', 'Momentum')
        self.assertEqual(results[0]['excerpt'], '')

    @patch('apps.classroom.services.research_context.research_evidence')
    def test_context_numbers_sources_without_altering_evidence(self, research):
        from apps.classroom.services.research_context import build_research_context
        item = {'title': 'Source', 'url': 'https://example.org', 'excerpt': 'Evidence', 'provider': 'tavily'}
        research.return_value = {'evidence': [item], 'errors': []}
        context, metadata = build_research_context('Momentum')
        self.assertEqual(metadata['sources'][0]['number'], 1)
        self.assertNotIn('number', item)
        self.assertIn('Evidence', context)
