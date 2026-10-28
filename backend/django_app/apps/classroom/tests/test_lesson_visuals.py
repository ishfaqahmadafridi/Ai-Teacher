"""Per-concept visual assignment; no topic defaults or image carry-over."""
from unittest.mock import patch
from django.test import SimpleTestCase
from apps.classroom.services.lesson_visuals import resolve_lesson_visuals
from apps.classroom.serializers.answer_serializers import GeneratedAnswerSerializer
from apps.classroom.tests.lecture_note_fixtures import lesson_answer


class LessonVisualTests(SimpleTestCase):
    @patch('apps.classroom.services.lesson_visuals.cache.get', return_value=None)
    @patch('apps.classroom.services.lesson_visuals.search_openverse_images')
    @patch('apps.classroom.services.lesson_visuals.search_lesson_images', return_value=[{'title':'Frog brain','description':''}])
    def test_irrelevant_first_provider_continues_to_second(self, commons, openverse, cache):
        from apps.classroom.services.lesson_visuals import concept_image
        image = {'title':'Human lung airways','description':''}
        openverse.return_value = [image]
        self.assertEqual(concept_image('human lungs airways'), [image])
        openverse.assert_called_once()
    @patch('apps.classroom.services.visual_selection.select_concept_images', return_value=({}, 0))
    @patch('apps.classroom.services.lesson_visuals.concept_image', return_value=[])
    def test_missing_model_query_uses_actual_concept_without_ai(self, search, select):
        answer = {'topic':'Midbrain','diagram_type':'default','chunks':[{'speak':'The tectum processes visual information.','key_point':'Tectum structure','diagram':{'action':'none'}}]}
        result = resolve_lesson_visuals(answer)
        search.assert_called_once_with('Midbrain Tectum structure')
        self.assertNotIn('target', result['chunks'][0]['diagram'])

    def setUp(self):
        materialize = patch('apps.classroom.services.visual_assets.materialize_image', side_effect=lambda image: image)
        materialize.start()
        self.addCleanup(materialize.stop)
        repair = patch('apps.classroom.services.visual_planning.refine_visual_queries', return_value=({}, 0))
        repair.start()
        self.addCleanup(repair.stop)

    @patch('apps.classroom.services.visual_selection.select_concept_images')
    @patch('apps.classroom.services.lesson_visuals.concept_image')
    def test_failed_search_is_refined_once(self, search, select):
        answer = lesson_answer()
        answer['chunks'][0]['diagram']['image_query'] = 'human brain labelled diagram'
        image = {'target': 'https://example.org/brain.png', 'author': 'Author', 'license': 'CC BY', 'source': 'https://example.org/source'}
        select.side_effect = [({}, 0), ({'human brain labelled diagram': image}, 4)]
        with patch('apps.classroom.services.visual_planning.refine_visual_queries', return_value=({'human brain labelled diagram': 'human brain anatomy'}, 3)) as repair:
            result = resolve_lesson_visuals(answer)
        repair.assert_called_once()
        self.assertEqual(search.call_count, 2)
        self.assertEqual(result['visual_selection_tokens'], 7)
        self.assertEqual(result['chunks'][0]['diagram']['target'], image['target'])

    @patch('apps.classroom.services.visual_selection.select_concept_images')
    @patch('apps.classroom.services.lesson_visuals.concept_image', return_value=[])
    def test_visual_matches_only_its_requested_step(self, search, select):
        query = 'human ear ossicles labelled anatomy'
        image = {'target': 'https://api.openverse.org/v1/images/id/thumb/', 'author': 'Author', 'license': 'CC BY', 'source': 'https://example.org/source'}
        select.return_value = ({query: image}, 0)
        answer = lesson_answer()
        answer['chunks'][0]['diagram']['image_query'] = query
        answer['chunks'].append({'speak': 'A different concept', 'diagram': {'action': 'none'}})
        result = resolve_lesson_visuals(answer)
        self.assertEqual(result['chunks'][0]['diagram']['target'], image['target'])
        self.assertNotIn('target', result['chunks'][1]['diagram'])

    @patch('apps.classroom.services.lesson_visuals.concept_image', return_value=[])
    def test_missing_image_never_gets_a_default_picture(self, search):
        answer = lesson_answer()
        answer['chunks'][0]['diagram']['image_query'] = 'human ear labelled diagram'
        result = resolve_lesson_visuals(answer)
        self.assertEqual(result['chunks'][0]['diagram']['visual_status'], 'unavailable')
        self.assertNotIn('target', result['chunks'][0]['diagram'])

    def test_asset_id_does_not_resolve_a_static_picture(self):
        answer = lesson_answer()
        answer['chunks'][0]['diagram']['asset_id'] = 'heart_anatomy'
        serializer = GeneratedAnswerSerializer(data=answer)
        self.assertTrue(serializer.is_valid())
        self.assertNotIn('asset_id', serializer.validated_data['chunks'][0]['diagram'])

    def test_overlong_query_rejected(self):
        answer = lesson_answer()
        answer['chunks'][0]['diagram']['image_query'] = 'x' * 151
        self.assertFalse(GeneratedAnswerSerializer(data=answer).is_valid())

    @patch('apps.classroom.services.lesson_visuals.cache.get', return_value=None)
    @patch('apps.classroom.services.lesson_visuals.search_openverse_images', return_value=[{'title': 'human ear ossicles diagram'}])
    @patch('apps.classroom.services.lesson_visuals.search_lesson_images', side_effect=RuntimeError('Unavailable'))
    def test_openverse_fallback_uses_the_concept_query(self, commons, openverse, cache):
        from apps.classroom.services.lesson_visuals import concept_image
        self.assertEqual(concept_image('human ear ossicles'), [{'title': 'human ear ossicles diagram'}])
        openverse.assert_called_once_with('human ear ossicles')
