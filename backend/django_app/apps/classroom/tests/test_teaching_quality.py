"""New lesson structure, independent evidence review and bounded repair behavior."""
from copy import deepcopy
import json
from unittest.mock import Mock, patch
from django.test import SimpleTestCase, TestCase
from langchain_core.messages import AIMessage
from apps.classroom.constants.teaching_quality import QUALITY_CHECKS
from apps.classroom.services.teaching_quality import (
    validate_teaching_structure, review_teaching_quality, generate_reviewed_teaching, TeachingQualityError, normalize_teaching_metadata,
)
from apps.classroom.tests.lecture_note_fixtures import quality_lesson
from apps.classroom.serializers.answer_serializers import GeneratedAnswerSerializer


def review_response(answer, failed=None, invented=False):
    return AIMessage(content=json.dumps({'findings': [
        {'check': check, 'passed': check != failed, 'reason': 'Actual narration assessed.',
         'section_index': {'examples': 2, 'assessment': 5}.get(check, 1),
         'quote': 'invented evidence' if invented else answer['chunks'][{'examples': 2, 'assessment': 5}.get(check, 1)]['speak']}
        for check in QUALITY_CHECKS]}), usage_metadata={'input_tokens': 10, 'output_tokens': 10, 'total_tokens': 20})


class TeachingQualityTests(SimpleTestCase):
    def test_only_unambiguous_missing_stage_metadata_is_normalized(self):
        answer = quality_lesson()
        original_speech = [c['speak'] for c in answer['chunks']]
        del answer['lesson_mode']
        del answer['chunks'][3]['teaching_step']
        del answer['chunks'][5]['teaching_step']
        normalize_teaching_metadata(answer)
        validate_teaching_structure(answer)
        self.assertEqual([c['speak'] for c in answer['chunks']], original_speech)
        answer['chunks'] = [c for c in answer['chunks'] if not c.get('discussion_prompt')]
        normalize_teaching_metadata(answer)
        with self.assertRaises(TeachingQualityError):
            validate_teaching_structure(answer)

    def test_complete_concept_block_passes_structure(self):
        validate_teaching_structure(quality_lesson())

    def test_missing_discussion_cannot_pass_as_a_full_lesson(self):
        answer = quality_lesson()
        answer['chunks'] = [c for c in answer['chunks'] if not c.get('discussion_prompt')]
        with self.assertRaisesRegex(TeachingQualityError, 'discussion_prompt'):
            validate_teaching_structure(answer)

    def test_a_heading_or_example_without_explanation_does_not_pass(self):
        for step in ('explanation', 'example'):
            answer = quality_lesson()
            answer['chunks'] = [c for c in answer['chunks'] if c['teaching_step'] != step]
            with self.subTest(missing=step), self.assertRaises(TeachingQualityError):
                validate_teaching_structure(answer)

    def test_a_concept_must_not_jump_between_disconnected_blocks(self):
        answer = quality_lesson()
        answer['chunks'][4]['concept_id'] = 'different'
        with self.assertRaises(TeachingQualityError):
            validate_teaching_structure(answer)

    def test_question_invitation_must_be_spoken_and_not_adjacent_to_a_check(self):
        answer = quality_lesson()
        answer['chunks'][3]['speak'] = 'A different sentence.'
        with self.assertRaises(TeachingQualityError):
            validate_teaching_structure(answer)
        answer = quality_lesson()
        answer['chunks'].pop(4)
        with self.assertRaisesRegex(TeachingQualityError, 'Separate'):
            validate_teaching_structure(answer)

    def test_saved_quiz_cannot_be_relabelled_as_a_lesson(self):
        with self.assertRaises(TeachingQualityError):
            validate_teaching_structure(quality_lesson(), {'session_kind': 'quiz'})

    def test_full_scheduled_scope_cannot_be_relabelled_as_focused(self):
        answer = quality_lesson()
        answer['lesson_mode'] = 'focused'
        with self.assertRaises(TeachingQualityError):
            validate_teaching_structure(answer, {}, True)

    def test_quiz_and_clarification_do_not_gain_automatic_q_and_a(self):
        for mode in ('quiz', 'clarification'):
            answer = quality_lesson()
            answer['lesson_mode'] = mode
            with self.subTest(mode=mode), self.assertRaises(TeachingQualityError):
                validate_teaching_structure(answer)

    def test_valid_quiz_and_clarification_remain_supported(self):
        quiz = {'lesson_mode': 'quiz', 'chunks': [{'speak': 'What is net force?', 'question': 'What is net force?', 'expected_concepts': ['Vector sum of forces'], 'diagram': {}}]}
        validate_teaching_structure(quiz, {'session_kind': 'quiz'}, True)
        validate_teaching_structure({'lesson_mode': 'clarification', 'chunks': [{'speak': 'Which organ do you mean?', 'diagram': {}}]})

    def test_passed_assessment_review_cannot_cite_a_nonquestion_chunk(self):
        answer = quality_lesson()
        model = Mock()
        data = json.loads(review_response(answer).text)
        item = next(f for f in data['findings'] if f['check'] == 'assessment')
        item['section_index'] = 1
        item['quote'] = answer['chunks'][1]['speak']
        model.invoke.return_value = AIMessage(content=json.dumps(data))
        issues, _ = review_teaching_quality(model, 'Teach roots', [], {}, answer)
        self.assertTrue(any(issue.startswith('assessment:') for issue in issues))

    def test_malformed_review_usage_is_counted_before_it_is_rejected(self):
        answer = quality_lesson()
        model = Mock()
        model.invoke.return_value = AIMessage(content='{"findings":', usage_metadata={'input_tokens': 10, 'output_tokens': 10, 'total_tokens': 20})
        ledger = {'review_tokens': 0}
        with self.assertRaises(ValueError):
            review_teaching_quality(model, 'Teach roots', [], {}, answer, usage_ledger=ledger)
        self.assertEqual(ledger['review_tokens'], 20)

    def test_saved_legacy_answers_are_still_readable(self):
        serializer = GeneratedAnswerSerializer(data={'chunks': [{'speak': 'Saved explanation.', 'diagram': {}}]})
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_independent_review_requires_real_quote_evidence(self):
        answer = quality_lesson()
        model = Mock()
        model.invoke.return_value = review_response(answer, invented=True)
        issues, tokens = review_teaching_quality(model, 'Explain roots', [], {}, answer)
        self.assertEqual(len(issues), len(QUALITY_CHECKS))
        self.assertEqual(tokens, 20)

    def test_review_rejects_a_failed_subject_depth_judgment(self):
        answer = quality_lesson()
        model = Mock()
        model.invoke.return_value = review_response(answer, failed='subject_depth')
        issues, _ = review_teaching_quality(model, 'Explain roots', [], {}, answer)
        self.assertTrue(issues[0].startswith('subject_depth:'))

    def test_reviewer_must_cover_exactly_every_check(self):
        answer = quality_lesson()
        model = Mock()
        data = json.loads(review_response(answer).text)
        data['findings'][-1] = data['findings'][0]
        model.invoke.return_value = AIMessage(content=json.dumps(data))
        from rest_framework.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            review_teaching_quality(model, 'Explain roots', [], {}, answer)

    def test_one_regeneration_repairs_missing_invitation_before_publication(self):
        answer = quality_lesson()
        incomplete = deepcopy(answer)
        incomplete['chunks'].pop(3)
        model = Mock()
        model.invoke.side_effect = [AIMessage(content=json.dumps(incomplete)), AIMessage(content=json.dumps(answer)), review_response(answer)]
        metadata = {}
        accepted, _, tokens = generate_reviewed_teaching(model, 'Teach roots', [], {}, 32768, 8192, metadata)
        self.assertEqual(accepted['chunks'][3]['discussion_prompt'], answer['chunks'][3]['discussion_prompt'])
        self.assertEqual(model.invoke.call_count, 3)
        self.assertEqual(metadata['teaching_quality']['attempts'], 2)
        self.assertTrue(metadata['teaching_quality']['passed'])
        self.assertEqual(tokens, 20)
        repair_input = json.loads(model.invoke.call_args_list[1].args[0][-2].content)
        self.assertIn('discussion_prompt', repair_input['reference_context']['quality_feedback'])

    def test_repeated_bad_drafts_stop_after_two_generation_attempts(self):
        model = Mock()
        model.invoke.return_value = AIMessage(content=json.dumps({'chunks': [{'speak': 'Only a heading', 'diagram': {}}]}))
        with self.assertRaises(TeachingQualityError):
            generate_reviewed_teaching(model, 'Teach roots', [], {}, 32768, 8192, {})
        self.assertEqual(model.invoke.call_count, 2)


class TeachingPublicationTests(TestCase):
    def test_failed_quality_never_enters_persisted_history(self):
        from apps.classroom.inference.pipeline import generate_answer
        from apps.classroom.services.session_service import get_session
        model = Mock()
        model.invoke.return_value = AIMessage(content=json.dumps({'chunks': [{'speak': 'Incomplete', 'diagram': {}}]}))
        with patch('apps.classroom.inference.pipeline.get_llm', return_value=model), patch('apps.classroom.rag.search', return_value=''):
            result = generate_answer('Teach roots', session_id='quality-failure')
        self.assertEqual(result['topic'], 'unknown')
        self.assertFalse(result['model_info']['teaching_quality']['passed'])
        self.assertEqual(get_session('quality-failure'), [])


from apps.classroom.tests.lecture_note_fixtures import LectureNotesFixture


class TeachingHttpTests(LectureNotesFixture, TestCase):
    def test_reviewed_lesson_is_saved_through_the_authenticated_http_endpoint(self):
        from apps.classroom.models.lecture_notes import LectureNote
        answer = quality_lesson()
        model = Mock()
        model.invoke.side_effect = [AIMessage(content=json.dumps(answer)), review_response(answer)]
        with patch('apps.classroom.inference.pipeline.get_llm', return_value=model), patch('apps.classroom.rag.search', return_value=''):
            response = self.client.post('/api/ask/', {'question': 'Teach roots', 'session_id': 'quality-http'}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['model_info']['teaching_quality']['passed'])
        saved = LectureNote.objects.get(pk=response.data['model_info']['note_id'])
        self.assertEqual(saved.answer['lesson_mode'], 'lesson')
        self.assertEqual(saved.answer['chunks'][3]['discussion_prompt'], answer['chunks'][3]['discussion_prompt'])
        self.assertEqual(saved.user, self.user)

    def test_incomplete_http_result_is_not_saved_as_a_new_lecture(self):
        from apps.classroom.models.lecture_notes import LectureNote
        count = LectureNote.objects.count()
        model = Mock()
        model.invoke.return_value = AIMessage(content=json.dumps({'chunks': [{'speak': 'Only a heading.', 'diagram': {}}]}))
        with patch('apps.classroom.inference.pipeline.get_llm', return_value=model), patch('apps.classroom.rag.search', return_value=''):
            response = self.client.post('/api/ask/', {'question': 'Teach roots', 'session_id': 'quality-http-fail'}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['topic'], 'unknown')
        self.assertNotIn('note_id', response.data['model_info'])
        self.assertEqual(LectureNote.objects.count(), count)
