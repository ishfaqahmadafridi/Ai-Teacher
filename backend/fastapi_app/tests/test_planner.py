"""Preview planner must not fabricate registration or collide slots."""
import unittest
from app.agents.nodes.planner import planner_node


class PlannerTests(unittest.IsolatedAsyncioTestCase):
    async def test_empty_registration_does_not_invent_courses(self):
        result = await planner_node({'metadata': {}})
        self.assertEqual(result['structured_data']['schedule'], [])

    async def test_repeated_patterns_do_not_overlap(self):
        result = await planner_node({'metadata': {'registered_courses': ['A', 'B', 'C', 'D', 'E'], 'max_classes_per_day': 4}})
        slots = [(item['dayOfWeek'], item['timeSlot']) for item in result['structured_data']['schedule']]
        self.assertEqual(len(slots), len(set(slots)))

    async def test_preview_does_not_invent_teacher_or_room(self):
        result = await planner_node({'metadata': {'registered_courses': ['A']}})
        self.assertTrue(all(not item['instructorName'] and not item['roomOrLink'] for item in result['structured_data']['schedule']))
