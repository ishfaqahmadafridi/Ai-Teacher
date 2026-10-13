"""Reviewed image selection and provenance survive lesson preparation."""
from django.test import SimpleTestCase
from apps.classroom.services.lesson_visuals import resolve_lesson_visuals, visual_catalog_prompt
from apps.classroom.serializers.ask_serializers import GeneratedAnswerSerializer
from apps.classroom.tests.test_lecture_notes import lesson_answer


class LessonVisualTests(SimpleTestCase):
    def test_selected_asset_and_credit_are_resolved(self):
        answer = lesson_answer()
        answer['chunks'][0]['diagram']['asset_id'] = 'female_reproductive'
        result = resolve_lesson_visuals(answer)
        self.assertEqual(result['diagram_type'], 'image')
        self.assertEqual(result['chunks'][0]['diagram']['target'], '/classroom-assets/anatomy/female-reproductive.jpg')
        self.assertIn('CC BY 3.0', result['chunks'][0]['diagram']['annotation'])

    def test_unknown_asset_rejected(self):
        answer = lesson_answer()
        answer['chunks'][0]['diagram']['asset_id'] = 'invented'
        self.assertFalse(GeneratedAnswerSerializer(data=answer).is_valid())

    def test_other_topics_are_not_forced_to_anatomy(self):
        answer = lesson_answer()
        before = answer['diagram_type']
        self.assertEqual(resolve_lesson_visuals(answer)['diagram_type'], before)
        self.assertIn('female_reproductive', visual_catalog_prompt())
