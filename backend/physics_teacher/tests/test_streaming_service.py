"""
physics_teacher/tests/test_streaming_service.py

Unit tests for the streaming service helper functions.
No real LLM or network calls are made — all pure function tests.
"""

from django.test import SimpleTestCase

from physics_teacher.services.streaming_service import (
    strip_markdown_fences,
    extract_json_object,
    build_fallback_response,
    _apply_teacher_position_defaults,
)


class StripMarkdownFencesTests(SimpleTestCase):
    """strip_markdown_fences() — remove Gemini's code fences if present."""

    def test_removes_json_fence(self):
        raw = '```json\n{"key": "value"}\n```'
        result = strip_markdown_fences(raw)
        self.assertEqual(result, '{"key": "value"}')

    def test_removes_plain_fence(self):
        raw = '```\n{"key": "value"}\n```'
        result = strip_markdown_fences(raw)
        self.assertEqual(result, '{"key": "value"}')

    def test_passthrough_when_no_fence(self):
        raw = '{"key": "value"}'
        result = strip_markdown_fences(raw)
        self.assertEqual(result, '{"key": "value"}')

    def test_strips_surrounding_whitespace(self):
        raw = '  {"key": "value"}  '
        result = strip_markdown_fences(raw)
        self.assertEqual(result, '{"key": "value"}')


class ExtractJsonObjectTests(SimpleTestCase):
    """extract_json_object() — parse JSON from Gemini's raw text."""

    def test_parses_clean_json(self):
        text = '{"topic": "gravity", "phases": []}'
        result = extract_json_object(text)
        self.assertEqual(result['topic'], 'gravity')
        self.assertEqual(result['phases'], [])

    def test_extracts_json_with_surrounding_noise(self):
        text = 'Here is your JSON:\n{"topic": "waves"}\nEnd.'
        result = extract_json_object(text)
        self.assertEqual(result['topic'], 'waves')

    def test_raises_on_malformed_json(self):
        with self.assertRaises(ValueError):
            extract_json_object('this is not json at all')

    def test_raises_when_no_braces(self):
        with self.assertRaises(ValueError):
            extract_json_object('completely plain text with no JSON')

    def test_parses_nested_json(self):
        text = '{"topic": "atom", "phases": [{"phase": 0, "speak": "test"}]}'
        result = extract_json_object(text)
        self.assertEqual(len(result['phases']), 1)
        self.assertEqual(result['phases'][0]['speak'], 'test')


class BuildFallbackResponseTests(SimpleTestCase):
    """build_fallback_response() — always produces a valid TeachingResponse shape."""

    def test_returns_dict(self):
        result = build_fallback_response('What is gravity?')
        self.assertIsInstance(result, dict)

    def test_required_top_level_keys(self):
        result = build_fallback_response('test question')
        self.assertIn('topic', result)
        self.assertIn('language', result)
        self.assertIn('diagram_type', result)
        self.assertIn('phases', result)

    def test_phases_is_list_with_two_entries(self):
        result = build_fallback_response('test question')
        self.assertIsInstance(result['phases'], list)
        self.assertEqual(len(result['phases']), 2)

    def test_last_phase_has_wait_for_answer(self):
        result = build_fallback_response('test question')
        last_phase = result['phases'][-1]
        self.assertTrue(last_phase.get('wait_for_answer'))

    def test_student_question_appears_in_last_phase(self):
        result = build_fallback_response('What is gravity?')
        last_phase = result['phases'][-1]
        self.assertIn('What is gravity?', last_phase['speak'])


class ApplyTeacherPositionDefaultsTests(SimpleTestCase):
    """_apply_teacher_position_defaults() — fills missing teacher_position fields."""

    def test_phase_0_gets_left(self):
        phases = [{'phase': 0}]
        _apply_teacher_position_defaults(phases)
        self.assertEqual(phases[0]['teacher_position'], 'left')

    def test_phase_1_gets_right(self):
        phases = [{'phase': 0}, {'phase': 1}]
        _apply_teacher_position_defaults(phases)
        self.assertEqual(phases[1]['teacher_position'], 'right')

    def test_last_phase_gets_center(self):
        phases = [{'phase': 0}, {'phase': 1}, {'phase': 2}]
        _apply_teacher_position_defaults(phases)
        self.assertEqual(phases[2]['teacher_position'], 'center')

    def test_does_not_overwrite_existing_position(self):
        phases = [{'phase': 0, 'teacher_position': 'right'}]
        _apply_teacher_position_defaults(phases)
        self.assertEqual(phases[0]['teacher_position'], 'right')
