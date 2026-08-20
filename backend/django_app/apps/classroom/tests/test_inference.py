"""
teacher/tests/test_inference.py

Unit tests for LLM service helpers and session service.
No external calls — tests are fast and offline.
"""

from django.test import SimpleTestCase

from apps.classroom.services.llm_service import extract_json, fallback_chunks
from apps.classroom.services.session_service import get_session, save_session, clear_session


# ── LLM Service Tests ─────────────────────────────────────────────────────────

class ExtractJsonTests(SimpleTestCase):
    """extract_json() — parse JSON from Gemini's raw response."""

    def test_parses_clean_json(self):
        raw = '{"chunks": [], "topic": "gravity"}'
        result = extract_json(raw)
        self.assertEqual(result['topic'], 'gravity')
        self.assertEqual(result['chunks'], [])

    def test_strips_markdown_fences(self):
        raw = '```json\n{"topic": "wave"}\n```'
        result = extract_json(raw)
        self.assertEqual(result['topic'], 'wave')

    def test_extracts_from_surrounding_text(self):
        raw = 'Here is the response:\n{"topic": "atom"}\nDone.'
        result = extract_json(raw)
        self.assertEqual(result['topic'], 'atom')

    def test_raises_on_no_json(self):
        with self.assertRaises(ValueError):
            extract_json('this has no JSON at all')

    def test_raises_on_malformed_json(self):
        with self.assertRaises(ValueError):
            extract_json('{not valid json...}')


class FallbackChunksTests(SimpleTestCase):
    """fallback_chunks() — produces a safe response structure."""

    def test_returns_dict_with_required_keys(self):
        result = fallback_chunks('What is energy?')
        self.assertIn('chunks', result)
        self.assertIn('topic', result)
        self.assertIn('diagram_type', result)
        self.assertIn('language', result)

    def test_chunks_is_non_empty_list(self):
        result = fallback_chunks('What is energy?')
        self.assertIsInstance(result['chunks'], list)
        self.assertGreater(len(result['chunks']), 0)

    def test_chunk_has_speak_and_diagram(self):
        result = fallback_chunks('test')
        chunk = result['chunks'][0]
        self.assertIn('speak', chunk)
        self.assertIn('diagram', chunk)

    def test_diagram_action_is_none(self):
        result = fallback_chunks('test')
        self.assertEqual(result['chunks'][0]['diagram']['action'], 'none')


# ── Session Service Tests ─────────────────────────────────────────────────────

class SessionServiceTests(SimpleTestCase):
    """session_service — get, save, and clear conversation history."""

    def setUp(self):
        # Ensure a clean session for each test
        clear_session('test-session')

    def test_get_session_returns_empty_list_for_new_session(self):
        history = get_session('brand-new-session-xyz')
        self.assertEqual(history, [])
        clear_session('brand-new-session-xyz')

    def test_save_and_retrieve_session(self):
        history = [{'role': 'user', 'content': 'What is gravity?'}]
        save_session('test-session', history)
        retrieved = get_session('test-session')
        self.assertEqual(len(retrieved), 1)
        self.assertEqual(retrieved[0]['content'], 'What is gravity?')

    def test_clear_session_removes_history(self):
        save_session('test-session', [{'role': 'user', 'content': 'test'}])
        clear_session('test-session')
        history = get_session('test-session')
        self.assertEqual(history, [])

    def test_save_session_caps_at_max_history(self):
        # Build a history of 50 entries (exceeds MAX_HISTORY_LENGTH = 40)
        long_history = [{'role': 'user', 'content': f'msg {i}'} for i in range(50)]
        save_session('test-session', long_history)
        retrieved = get_session('test-session')
        # Should be capped at 40 entries — the last 40
        self.assertLessEqual(len(retrieved), 40)
        self.assertEqual(retrieved[-1]['content'], 'msg 49')

    def test_clear_nonexistent_session_does_not_raise(self):
        try:
            clear_session('session-that-does-not-exist')
        except Exception as exc:
            self.fail(f'clear_session raised unexpectedly: {exc}')
