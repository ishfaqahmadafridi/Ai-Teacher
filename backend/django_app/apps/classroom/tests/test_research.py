"""Research graph execution, cache reuse and failure isolation tests."""
from unittest.mock import patch
from django.test import SimpleTestCase, override_settings
from django.core.cache import cache
from apps.classroom.agents.research import research_evidence


@override_settings(CACHES={'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'}})
class ResearchGraphTests(SimpleTestCase):
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
    def test_cached_evidence_preserves_current_question_without_storing_question(self, search):
        search.return_value = [{'title': 'Source', 'url': 'https://example.org',
                                'excerpt': 'Evidence', 'provider': 'tavily'}]
        research_evidence('Momentum')
        result = research_evidence(' momentum ')
        self.assertEqual(result['question'], ' momentum ')
        self.assertEqual(search.call_count, 2)
        import hashlib
        key = 'research:v2:' + hashlib.sha256(b'momentum').hexdigest()
        self.assertNotIn('question', cache.get(key))


    @patch('apps.classroom.services.research_search.search_provider')
    def test_failures_are_bounded_and_do_not_expose_secrets(self, search):
        search.side_effect = RuntimeError('secret-key-in-url')
        result = research_evidence('Momentum')
        self.assertEqual(result['evidence'], [])
        self.assertEqual(result['errors'], ['tavily', 'openalex'])
        self.assertNotIn('secret-key', str(result))
        self.assertEqual(search.call_count, 2)


    @patch('apps.classroom.agents.research.graph.cache.get', side_effect=RuntimeError('cache offline'))
    @patch('apps.classroom.services.research_search.search_provider', return_value=[])
    def test_cache_outage_does_not_prevent_research(self, search, cache_get):
        self.assertEqual(research_evidence('Momentum')['evidence'], [])
        self.assertEqual(search.call_count, 2)
