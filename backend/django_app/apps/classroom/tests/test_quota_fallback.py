"""No network calls: verify failover boundaries and provider request contract."""
from unittest.mock import Mock, patch
import httpx
from django.test import SimpleTestCase
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from apps.classroom.services.quota_fallback import QuotaFallbackLLM, is_quota_error


class QuotaFallbackTests(SimpleTestCase):
    def error(self, status):
        return httpx.HTTPStatusError('Provider error', request=httpx.Request('POST', 'https://example.test'),
                                     response=httpx.Response(status))

    def test_primary_success_never_calls_fallback(self):
        primary = Mock()
        primary.invoke.return_value = AIMessage(content='{}')
        with patch('apps.classroom.services.quota_fallback.httpx.Client') as client:
            self.assertEqual(QuotaFallbackLLM(primary, 'test-key', 0.2).invoke('JSON please').content, '{}')
        client.assert_not_called()

    def test_only_explicit_quota_errors_trigger_fallback(self):
        for status in (400, 401, 403, 500, 503):
            primary = Mock()
            primary.invoke.side_effect = self.error(status)
            with patch('apps.classroom.services.quota_fallback.httpx.Client') as client:
                with self.assertRaises(httpx.HTTPStatusError):
                    QuotaFallbackLLM(primary, 'test-key', 0.2).invoke('JSON please')
            client.assert_not_called()

    def test_quota_fallback_preserves_messages_usage_and_options(self):
        primary = Mock()
        primary.bind.return_value.invoke.side_effect = self.error(429)
        response = Mock()
        response.json.return_value = {'choices': [{'message': {'content': '{"chunks":[]}'}}],
                                      'usage': {'prompt_tokens': 10, 'completion_tokens': 5}}
        with patch('apps.classroom.services.quota_fallback.httpx.Client') as factory:
            client = factory.return_value.__enter__.return_value
            client.post.return_value = response
            result = QuotaFallbackLLM(primary, 'test-key', 0.2).bind(max_output_tokens=100).invoke([
                SystemMessage(content='Return JSON'), HumanMessage(content='Explain a beam')])
        payload = client.post.call_args.kwargs['json']
        self.assertEqual(payload['messages'][0]['role'], 'system')
        self.assertEqual(payload['messages'][1]['content'], 'Explain a beam')
        self.assertEqual(payload['max_completion_tokens'], 100)
        self.assertEqual(payload['response_format'], {'type': 'json_object'})
        self.assertEqual(result.usage_metadata['total_tokens'], 15)
        self.assertEqual(result.response_metadata['classroom_provider'], 'groq')

    def test_fallback_failure_is_not_retried_or_hidden(self):
        primary = Mock()
        primary.invoke.side_effect = self.error(429)
        with patch('apps.classroom.services.quota_fallback.httpx.Client') as factory:
            client = factory.return_value.__enter__.return_value
            client.post.side_effect = httpx.ReadTimeout('timeout')
            with self.assertRaises(httpx.ReadTimeout):
                QuotaFallbackLLM(primary, 'test-key', 0.2).invoke('Return JSON')
            self.assertEqual(client.post.call_count, 1)

    def test_sdk_quota_status_and_generic_errors(self):
        from google.genai.errors import ClientError
        from langchain_google_genai.chat_models import GoogleRateLimitError
        cause = ClientError(429, {'error': {'message': 'quota', 'status': 'RESOURCE_EXHAUSTED'}})
        wrapped = GoogleRateLimitError('quota')
        wrapped.__cause__ = cause
        self.assertTrue(is_quota_error(cause))
        self.assertTrue(is_quota_error(wrapped))
        self.assertFalse(is_quota_error(ValueError('429 in unrelated content')))

    def test_get_llm_enables_fallback_only_with_key(self):
        from apps.classroom.services.llm_service import get_llm
        with patch.dict('os.environ', {'GEMINI_API_KEY': 'test-primary', 'GROQ_API_KEY': 'test-fallback'}), patch('apps.classroom.services.llm_service._create_llm') as primary:
            self.assertIsInstance(get_llm(), QuotaFallbackLLM)
            with patch.dict('os.environ', {'GROQ_API_KEY': ''}):
                self.assertIs(get_llm(), primary.return_value)

    def test_primary_client_requests_json_output(self):
        from apps.classroom.services.llm_service import _create_llm
        _create_llm.cache_clear()
        try:
            with patch('langchain_google_genai.ChatGoogleGenerativeAI') as client:
                _create_llm('test-key', 'test-model', 0.1, 0)
                self.assertEqual(client.call_args.kwargs['response_mime_type'], 'application/json')
        finally:
            _create_llm.cache_clear()
