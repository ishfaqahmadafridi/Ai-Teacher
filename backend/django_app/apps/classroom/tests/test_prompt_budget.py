"""Offline request-budget invariants, including oversized multilingual content."""
import json
from types import SimpleNamespace
from unittest.mock import patch
from django.test import SimpleTestCase
from apps.classroom.services.prompt_budget import (
    budget_teaching_messages, estimate_tokens, model_prompt_limits, PromptBudgetExceeded,
)
from apps.classroom.services.teaching_messages import teaching_messages


class PromptBudgetTests(SimpleTestCase):
    def test_assembly_details_only_load_for_relevant_topics(self):
        plain = teaching_messages('Explain roots', [], {})[0].content
        bridge = teaching_messages('Explain a bridge', [], {})[0].content
        self.assertNotIn('OPTIONAL ASSEMBLIES', plain)
        self.assertIn('left_brace', bridge)
        self.assertNotIn('atom_4', bridge)
        molecule = teaching_messages('Explain molecules', [], {})[0].content
        self.assertIn('carbon_dioxide', molecule)
        self.assertNotIn('left_brace', molecule)

    def test_latest_question_and_saved_requirements_are_not_truncated(self):
        context = {'student': {'language': 'ur'}, 'scheduled_lesson': {'requirements': [{'id': 'a', 'label': 'Full requirement'}]},
                   'textbook': 'کتاب ' * 20000}
        original = json.dumps(context)
        messages, budget = budget_teaching_messages('Explain this concept', [], context, context_limit=18000, output_tokens=1000)
        self.assertEqual(messages[-1].content, 'Explain this concept')
        data = json.loads(messages[-2].content)['reference_context']
        self.assertEqual(data['scheduled_lesson'], context['scheduled_lesson'])
        self.assertEqual(data['student'], context['student'])
        self.assertTrue(budget['references_trimmed'])
        self.assertLessEqual(budget['estimated_input_tokens'] + budget['reserved_output_tokens'] + budget['safety_margin_tokens'], 18000)
        self.assertEqual(json.dumps(context), original)

    def test_history_drops_old_turns_without_an_orphan_assistant(self):
        history = [{'role': 'user', 'content': 'Old question'}, {'role': 'assistant', 'content': 'old ' * 3000},
                   {'role': 'user', 'content': 'Recent question'}, {'role': 'assistant', 'content': 'Recent answer'}]
        messages, budget = budget_teaching_messages('Now explain', history, {})
        self.assertEqual(messages[1].type, 'human')
        self.assertEqual(messages[1].content, 'Recent question')
        self.assertEqual(budget['history_messages_dropped'], 2)
        self.assertEqual(len(history), 4)

    def test_required_overflow_is_rejected_instead_of_silently_cutting_curriculum(self):
        with self.assertRaises(PromptBudgetExceeded):
            budget_teaching_messages('Current question', [], {'scheduled_lesson': {'requirements': ['a' * 100000]}},
                                     context_limit=18000, output_tokens=1000)

    def test_research_sources_are_whole_and_keep_original_citation_numbers(self):
        sources = [{'number': i, 'excerpt': 'evidence ' * 2500} for i in (1, 2, 3)]
        messages, budget = budget_teaching_messages('Explain evidence', [], {'research': {'sources': sources}},
                                                   context_limit=18000, output_tokens=1000)
        retained = json.loads(messages[-2].content)['reference_context']['research']['sources']
        self.assertEqual(retained, sources[:len(retained)])
        self.assertTrue(budget['references_trimmed'])
        self.assertEqual(len(sources), 3)

    @patch.dict('os.environ', {'GROQ_API_KEY': ''})
    def test_sdk_profile_restricts_operator_caps(self):
        model = SimpleNamespace(profile={'max_input_tokens': 16000, 'max_output_tokens': 2048})
        self.assertEqual(model_prompt_limits(model), (16000, 2048))
        with self.assertRaises(PromptBudgetExceeded):
            model_prompt_limits(SimpleNamespace(profile={'max_input_tokens': 100, 'max_output_tokens': 20}))

    @patch.dict('os.environ', {'GROQ_API_KEY': 'test'})
    @patch('apps.classroom.constants.prompt_budget.GROQ_CONTEXT_TOKENS', 16000)
    def test_fallback_uses_the_smaller_context_cap(self):
        model = SimpleNamespace(primary=SimpleNamespace(profile={'max_input_tokens': 1000000}))
        self.assertEqual(model_prompt_limits(model)[0], 16000)

    def test_unicode_estimate_accounts_for_utf8_bytes(self):
        from langchain_core.messages import HumanMessage
        self.assertGreaterEqual(estimate_tokens([HumanMessage(content='اردو' * 100)]), len(('اردو' * 100).encode('utf-8')))

    def test_focused_followup_keeps_the_recent_assembly_contract(self):
        messages = teaching_messages('Explain its support', [{'role': 'user', 'content': 'Explain a bridge'},
                                      {'role': 'assistant', 'content': 'The bridge has a deck.'}], {})
        self.assertIn('left_brace', messages[0].content)

    def test_secondary_review_rejects_overflow_without_calling_the_provider(self):
        from unittest.mock import Mock
        from apps.classroom.services.curriculum_coverage import review_curriculum_coverage
        model = Mock()
        answer = {'chunks': [{'curriculum_ids': ['a'], 'key_point': 'Roots', 'speak': 'Roots absorb water. ' + 'x' * 100000}]}
        curriculum = {'requirements': [{'id': 'a', 'label': 'Roots'}]}
        with self.assertRaises(PromptBudgetExceeded):
            review_curriculum_coverage(model, answer, curriculum, {})
        model.invoke.assert_not_called()

    def test_pipeline_rejects_required_overflow_before_provider_or_history_mutation(self):
        from unittest.mock import Mock
        from apps.classroom.inference.pipeline import generate_answer
        model = Mock()
        with patch('apps.classroom.inference.pipeline.get_llm', return_value=model), \
             patch('apps.classroom.rag.search', return_value=''), \
             patch('apps.classroom.inference.pipeline.get_session', return_value=[]), \
             patch('apps.classroom.inference.pipeline.append_session') as append:
            result = generate_answer('Explain', curriculum={'requirements': [{'label': 'x' * 100000}]})
        model.invoke.assert_not_called()
        append.assert_not_called()
        self.assertTrue(result['model_info']['context_budget_exceeded'])
