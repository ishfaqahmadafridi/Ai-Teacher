"""Bounded visual contracts and narration resilience."""
from copy import deepcopy
import json
from unittest.mock import patch
from django.test import SimpleTestCase
from langchain_core.messages import AIMessage
from apps.classroom.constants.visuals import ASSEMBLY_PARTS, MOLECULE_ATOM_COUNTS
from apps.classroom.serializers.structured_visual_serializers import StructuredVisualSerializer
from apps.classroom.serializers.diagram_fields import AnswerDiagramField
from .lecture_note_fixtures import schematic_visual


class ConceptualVisualTests(SimpleTestCase):
    def schematic(self):
        return schematic_visual()

    def test_schematic_preserves_edges_and_focus(self):
        schema = StructuredVisualSerializer(data=self.schematic())
        self.assertTrue(schema.is_valid(), schema.errors)
        self.assertEqual(schema.validated_data['focus'], 'a')
        self.assertEqual(schema.data, self.schematic())

    def test_invalid_graphs_are_rejected(self):
        for change in ('duplicate', 'unknown', 'self', 'nan', 'focus', 'limit'):
            value = deepcopy(self.schematic())
            if change == 'duplicate': value['nodes'][1]['id'] = 'a'
            elif change == 'unknown': value['edges'][0]['target'] = 'unknown'
            elif change == 'self': value['edges'][0]['target'] = 'a'
            elif change == 'nan': value['nodes'][0]['x'] = float('nan')
            elif change == 'focus': value['focus'] = 'unknown'
            else: value['nodes'] *= 7
            with self.subTest(change=change):
                self.assertFalse(StructuredVisualSerializer(data=value).is_valid())

    def test_all_approved_models_and_focus_parts(self):
        for model, parts in ASSEMBLY_PARTS.items():
            if model == 'molecule': continue
            for part in parts:
                schema = StructuredVisualSerializer(data={'kind': 'assembly', 'model': model, 'focus': part})
                self.assertTrue(schema.is_valid(), schema.errors)
                self.assertEqual(schema.validated_data['phase'], 0.5)
                self.assertEqual(schema.data['model'], model)
                self.assertEqual(schema.data['focus'], part)

    def test_molecules_enforce_actual_atom_count(self):
        for molecule, count in MOLECULE_ATOM_COUNTS.items():
            value = {'kind': 'assembly', 'model': 'molecule', 'molecule': molecule, 'focus': f'atom_{count - 1}'}
            self.assertTrue(StructuredVisualSerializer(data=value).is_valid())
            value['focus'] = f'atom_{count}'
            self.assertFalse(StructuredVisualSerializer(data=value).is_valid())

    def test_unsupported_geometry_is_rejected(self):
        for value in (
            {'kind': 'assembly', 'model': 'heart'},
            {'kind': 'assembly', 'model': 'molecule'},
            {'kind': 'assembly', 'model': 'bridge', 'molecule': 'water'},
            {'kind': 'assembly', 'model': 'piston', 'phase': float('inf')},
            {'kind': 'assembly', 'model': 'pulley', 'phase': -1},
        ):
            self.assertFalse(StructuredVisualSerializer(data=value).is_valid())

    def test_invalid_visual_does_not_discard_narration_diagram(self):
        result = AnswerDiagramField().run_validation({'action': 'none', 'visual': {'kind': 'assembly', 'model': 'unknown'}})
        self.assertNotIn('visual', result)
        self.assertEqual(result['visual_reason'], 'invalid_visual')

    def test_valid_visual_does_not_trigger_image_search(self):
        result = AnswerDiagramField().run_validation({'action': 'none', 'visual': self.schematic(), 'image_query': 'flow diagram'})
        self.assertNotIn('image_query', result)
        self.assertEqual(result['visual']['title'], 'Flow')

    def test_flat_assembly_repairs_missing_action_and_stale_image_failure(self):
        result = AnswerDiagramField().run_validation({'kind': 'assembly', 'model': 'pulley', 'focus': 'rope',
            'image_query': 'pulley rope', 'visual_status': 'unavailable', 'visual_reason': 'no_usable_asset'})
        self.assertEqual(result['action'], 'none')
        self.assertEqual(result['visual']['model'], 'pulley')
        self.assertNotIn('model', result)
        self.assertNotIn('image_query', result)
        self.assertNotIn('visual_status', result)

    def test_flat_schematic_and_invalid_actions_are_normalized(self):
        for action in (None, 'unsupported', ['highlight']):
            result = AnswerDiagramField().run_validation({**self.schematic(), 'action': action})
            self.assertEqual(result['action'], 'none')
            self.assertEqual(result['visual']['title'], 'Flow')

    def test_saved_lecture_output_uses_the_same_contract_repair(self):
        original = {'kind': 'assembly', 'model': 'piston', 'focus': 'rod'}
        result = AnswerDiagramField().to_representation(original)
        self.assertEqual(result['visual']['focus'], 'rod')
        self.assertEqual(result['action'], 'none')
        self.assertEqual(original, {'kind': 'assembly', 'model': 'piston', 'focus': 'rod'})

    def test_optional_fallback_is_validated_before_use(self):
        for fallback, expected in ((self.schematic(), True), ({'kind': 'assembly', 'model': 'heart'}, False)):
            result = AnswerDiagramField().run_validation({'action': 'none', 'fallback_visual': fallback})
            self.assertEqual('fallback_visual' in result, expected)

    def test_no_focus_sentinel_does_not_discard_valid_geometry(self):
        for value in ({**self.schematic(), 'focus': 'none'}, {'kind': 'assembly', 'model': 'pulley', 'focus': 'all'}):
            schema = StructuredVisualSerializer(data=value)
            self.assertTrue(schema.is_valid(), schema.errors)
            self.assertNotIn('focus', schema.validated_data)

    @patch('apps.classroom.inference.pipeline.get_session', return_value=[])
    @patch('apps.classroom.rag.search', return_value='')
    @patch('apps.classroom.inference.pipeline.get_llm')
    @patch('apps.classroom.services.lesson_visuals.concept_image')
    def test_generation_wires_contract_preserves_visual_and_reports_provider(self, image, llm, search, history):
        from apps.classroom.inference import generate_answer
        answer = {'topic': 'Bridge', 'language': 'en', 'diagram_type': 'default', 'chunks': [
            {'speak': 'The deck carries the traffic.', 'diagram': {'action': 'none', 'visual': {
                'kind': 'assembly', 'model': 'bridge', 'focus': 'deck'}}}]}
        llm.return_value.invoke.return_value = AIMessage(content=json.dumps(answer),
            response_metadata={'classroom_provider': 'groq', 'model_name': 'test-model'},
            usage_metadata={'input_tokens': 10, 'output_tokens': 20, 'total_tokens': 30})
        result = generate_answer('Explain a bridge', persist_history=False)
        self.assertEqual(result['chunks'][0]['diagram']['visual']['focus'], 'deck')
        self.assertEqual(result['tokens_used'], 30)
        self.assertEqual(result['model_info']['provider'], 'groq')
        prompt = llm.return_value.invoke.call_args.args[0][0].content
        self.assertIn('CONCEPTUAL VISUALS', prompt)
        self.assertIn('"left_brace"', prompt)
        self.assertNotIn('{assembly_catalog}', prompt)
        image.assert_not_called()
