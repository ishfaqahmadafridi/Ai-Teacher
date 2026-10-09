"""Search provider normalization and malformed evidence boundary tests."""
from unittest.mock import patch
from django.test import SimpleTestCase


class ResearchSearchTests(SimpleTestCase):

    @patch.dict('os.environ', {}, clear=True)
    @patch('apps.classroom.services.research_search._request')
    def test_missing_credentials_do_not_make_provider_requests(self, request):
        from apps.classroom.constants.research import PROVIDERS
        from apps.classroom.services.research_search import search_provider
        for provider in PROVIDERS:
            with self.subTest(provider=provider):
                self.assertEqual(search_provider(provider, 'Momentum'), [])
        request.assert_not_called()

    @patch.dict('os.environ', {'TAVILY_API_KEY': 'test-only'})
    @patch('apps.classroom.services.research_search._request')
    def test_evidence_uses_the_same_length_limits_as_its_schema(self, request):
        from apps.classroom.constants.research import EVIDENCE_TITLE_LIMIT, EVIDENCE_EXCERPT_LIMIT
        from apps.classroom.agents.research.state import Evidence
        from apps.classroom.services.research_search import search_provider
        request.return_value = {'results': [{
            'title': 'T' * (EVIDENCE_TITLE_LIMIT + 1),
            'url': 'https://example.org/source',
            'content': 'E' * (EVIDENCE_EXCERPT_LIMIT + 1),
        }]}
        result = search_provider('tavily', 'Momentum')[0]
        self.assertEqual(len(result['title']), EVIDENCE_TITLE_LIMIT)
        self.assertEqual(len(result['excerpt']), EVIDENCE_EXCERPT_LIMIT)
        Evidence.model_validate(result)

    @patch.dict('os.environ', {'TAVILY_API_KEY': 'test-only'})
    @patch('apps.classroom.services.research_search._request')
    def test_provider_filters_invalid_urls(self, request):
        from apps.classroom.services.research_search import search_provider
        valid = {'title': 'Valid', 'url': 'https://example.org/source', 'content': 'Evidence'}
        invalid_records = (
            {'title': 'Invalid', 'url': 'javascript:alert(1)', 'content': 'Bad'},
            None,
            {'title': None, 'url': 'https://example.org/null'},
            {'title': '   ', 'url': 'https://example.org/empty'},
            {'title': ['Invalid'], 'url': 'https://example.org/list'},
        )
        for invalid in invalid_records:
            with self.subTest(record=invalid):
                request.return_value = {'results': [invalid, valid]}
                results = search_provider('tavily', 'Momentum')
                self.assertEqual(len(results), 1)
                self.assertEqual(results[0]['excerpt'], 'Evidence')


    @patch.dict('os.environ', {'TAVILY_API_KEY': 'test-only'})
    @patch('apps.classroom.services.research_search._request')
    def test_null_excerpt_is_empty_and_malformed_excerpt_does_not_hide_valid_source(self, request):
        from apps.classroom.services.research_search import search_provider
        request.return_value = {'results': [
            {'title': 'Invalid', 'url': 'https://example.org/bad', 'content': []},
            {'title': 'Valid', 'url': 'https://example.org/source', 'content': None},
        ]}
        results = search_provider('tavily', 'Momentum')
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['excerpt'], '')


    @patch.dict('os.environ', {'OPENALEX_API_KEY': 'test-only'})
    @patch('apps.classroom.services.research_search._request')
    def test_paper_metadata_is_not_fabricated_as_excerpt(self, request):
        from apps.classroom.services.research_search import search_provider
        request.return_value = {'results': [{'display_name': 'Study', 'doi': 'https://doi.org/10.1/example'}]}
        results = search_provider('openalex', 'Momentum')
        self.assertEqual(results[0]['excerpt'], '')
