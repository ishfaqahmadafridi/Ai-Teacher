"""Missing visual queries are planned from lesson concepts, never defaults."""
from types import SimpleNamespace
from unittest.mock import patch
from django.test import SimpleTestCase
from apps.classroom.services.visual_planning import plan_missing_visuals


class VisualPlanningTests(SimpleTestCase):
    @patch('apps.classroom.services.visual_planning.get_llm')
    def test_missing_query_is_recovered_and_tokens_counted(self, llm):
        answer = {'topic': 'Brain', 'diagram_type': 'default', 'chunks': [
            {'speak': 'The cerebellum coordinates movement.', 'diagram': {'action': 'none'}}]}
        llm.return_value.invoke.return_value = SimpleNamespace(
            text='{"0": "human cerebellum labelled anatomy", "99": "invalid"}',
            usage_metadata={'total_tokens': 12})
        self.assertEqual(plan_missing_visuals(answer), 12)
        self.assertEqual(answer['chunks'][0]['diagram']['image_query'], 'human cerebellum labelled anatomy')

    @patch('apps.classroom.services.visual_planning.get_llm')
    def test_existing_visual_does_not_trigger_another_planning_call(self, llm):
        answer = {'diagram_type': 'image', 'chunks': [
            {'diagram': {'visual': {'kind': 'tree', 'nodes': []}}}]}
        self.assertEqual(plan_missing_visuals(answer), 0)
        llm.assert_not_called()
