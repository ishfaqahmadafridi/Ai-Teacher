"""Regression coverage for classroom validation, persistence, and RAG failures."""
import json
from unittest.mock import Mock, patch

from django.core.management import call_command, CommandError
from django.test import TestCase, SimpleTestCase
from langchain_core.messages import AIMessage

from apps.classroom.inference import generate_answer
from apps.classroom.models import ClassroomSession
from apps.classroom.services.llm_service import extract_json
from apps.classroom.services.session_service import (
    get_session, save_session, append_session, clear_session,
)


class JsonRegressionTests(SimpleTestCase):
    def test_rejects_non_object_json(self):
        for value in ('null', '[]', '[{"topic": "gravity"}]', '42'):
            with self.subTest(value=value), self.assertRaises(ValueError):
                extract_json(value)

    def test_handles_braces_in_strings_and_trailing_prose(self):
        self.assertEqual(extract_json('Answer: {"text": "a } brace"} trailing {'),
                         {"text": "a } brace"})


class PersistenceRegressionTests(TestCase):
    def test_reads_are_detached_and_do_not_create_empty_records(self):
        self.assertEqual(get_session('unused'), [])
        self.assertFalse(ClassroomSession.objects.exists())
        history = [{'role': 'user', 'content': 'original'}]
        save_session('persisted', history)
        history[0]['content'] = 'mutated'
        retrieved = get_session('persisted')
        retrieved[0]['content'] = 'changed'
        self.assertEqual(get_session('persisted')[0]['content'], 'original')
        clear_session('persisted')
        self.assertFalse(ClassroomSession.objects.exists())

    def test_append_preserves_existing_turns(self):
        append_session('session', [{'role': 'user', 'content': 'first'}])
        append_session('session', [{'role': 'user', 'content': 'second'}])
        self.assertEqual([entry['content'] for entry in get_session('session')],
                         ['first', 'second'])


class PipelineRegressionTests(TestCase):
    @patch('apps.classroom.inference.pipeline.get_llm')
    def test_missing_llm_returns_fallback_without_history(self, get_llm):
        get_llm.return_value = None
        result = generate_answer('What is gravity?', session_id='offline')
        self.assertTrue(result['chunks'])
        self.assertEqual(result['tokens_used'], 0)
        self.assertFalse(ClassroomSession.objects.exists())

    @patch('apps.classroom.rag.search', return_value='')
    @patch('apps.classroom.inference.pipeline.get_llm')
    def test_invalid_chunks_do_not_pollute_history(self, get_llm, search):
        get_llm.return_value.invoke.return_value = AIMessage(content='{"chunks": "invalid"}')
        result = generate_answer('What is gravity?', session_id='invalid')
        self.assertIsInstance(result['chunks'], list)
        self.assertEqual(get_session('invalid'), [])
        self.assertNotIn('error', result['model_info'])

    @patch('apps.classroom.rag.search', return_value='textbook context')
    @patch('apps.classroom.inference.pipeline.get_llm')
    def test_text_blocks_and_provider_token_usage(self, get_llm, search):
        answer = {'chunks': [{'speak': 'Gravity attracts masses.', 'diagram': {'action': 'none'},
                              'key_point': 'Masses attract', 'teacher_position': 'left'}],
                  'topic': 'gravity', 'language': 'en', 'diagram_type': 'gravity'}
        get_llm.return_value.invoke.return_value = AIMessage(
            content=[{'type': 'text', 'text': json.dumps(answer)}],
            usage_metadata={'input_tokens': 10, 'output_tokens': 20, 'total_tokens': 30},
        )
        result = generate_answer('What is gravity?', session_id='valid')
        self.assertEqual(result['tokens_used'], 30)
        self.assertTrue(result['model_info']['rag_used'])
        self.assertEqual(result['chunks'][0]['key_point'], 'Masses attract')
        self.assertEqual(len(get_session('valid')), 2)


class EndpointRegressionTests(TestCase):
    def test_nonfinite_temperature_is_rejected(self):
        from apps.classroom.serializers import AskRequestSerializer
        for value in (float('nan'), float('inf'), float('-inf')):
            with self.subTest(value=value):
                serializer = AskRequestSerializer(data={'question': 'gravity?', 'temperature': value})
                self.assertFalse(serializer.is_valid())

    @patch('apps.classroom.views.session_view.clear_session')
    def test_clear_rejects_invalid_session(self, clear):
        for session_id in ([], {}, '', 'x' * 129):
            with self.subTest(session_id=session_id):
                response = self.client.post('/api/clear/', {'session_id': session_id},
                                            content_type='application/json')
                self.assertEqual(response.status_code, 400)
        clear.assert_not_called()

    @patch('apps.classroom.views.ask_view.generate_answer', side_effect=RuntimeError('secret'))
    def test_error_response_does_not_expose_exception(self, generate):
        response = self.client.post('/api/ask/', {'question': 'What is gravity?'},
                                    content_type='application/json')
        self.assertEqual(response.status_code, 500)
        self.assertNotIn('secret', response.content.decode())


class RagRegressionTests(SimpleTestCase):
    @patch('apps.classroom.rag.searcher.embed_query', return_value=[1.0])
    @patch('apps.classroom.rag.searcher.get_collection')
    @patch('apps.classroom.rag.searcher.is_ready', return_value=True)
    def test_search_caps_results_to_collection_size(self, ready, get_collection, embed):
        from apps.classroom.rag.searcher import search
        collection = Mock()
        collection.count.return_value = 1
        collection.query.return_value = {'documents': [['one passage']]}
        get_collection.return_value = (collection, Mock())
        self.assertEqual(search('gravity', top_k=3), 'one passage')
        self.assertEqual(collection.query.call_args.kwargs['n_results'], 1)

    @patch('apps.classroom.rag.store._collection', None)
    @patch('apps.classroom.rag.store.get_sentence_model')
    @patch('apps.classroom.rag.store.build_from_pdf', return_value=None)
    @patch('apps.classroom.rag.store.try_load_existing', return_value=None)
    def test_unavailable_collection_does_not_load_embedding_model(self, existing, build, model):
        from apps.classroom.rag.store import get_collection
        self.assertEqual(get_collection(), (None, None))
        model.assert_not_called()

    @patch('apps.classroom.rag.get_collection', return_value=(None, None))
    def test_embed_command_reports_unavailable_collection(self, collection):
        with self.assertRaisesMessage(CommandError, 'RAG collection unavailable'):
            call_command('embed_pdf')
