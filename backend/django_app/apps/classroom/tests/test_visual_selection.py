"""Reject irrelevant or malformed provider/model image selections."""
from types import SimpleNamespace
from unittest.mock import patch

from django.test import SimpleTestCase

from apps.classroom.services.openverse_images import normalize_openverse_image
from apps.classroom.services.visual_selection import select_concept_images


class VisualSelectionTests(SimpleTestCase):
    def test_alveolus_alone_does_not_cover_capillary_network(self):
        from apps.classroom.services.visual_selection import rank_candidates
        incomplete = {'title':'Alveolus','description':''}
        complete = {'title':'Alveolar capillary membrane','description':''}
        self.assertEqual(rank_candidates('alveoli and capillaries', [incomplete, complete]), [complete])
    @patch('apps.classroom.services.visual_selection.get_llm')
    def test_matching_concept_uses_no_ai_and_rejects_ambiguity(self, llm):
        image = {'title': 'Human lungs', 'description': 'Lung anatomy'}
        self.assertEqual(select_concept_images({'human lungs labelled diagram': [image]}), ({'human lungs labelled diagram': image}, 0))
        self.assertEqual(select_concept_images({'human lungs': [image, image]}), ({'human lungs': image}, 0))
        self.assertEqual(select_concept_images({'human brain': [image]}), ({}, 0))
        llm.assert_not_called()
    def test_openverse_requires_reusable_attributed_image(self):
        record = {
            'id': 'e6886042-a1d9-4188-98ee-35e4e485e436',
            'title': 'Ear anatomy', 'creator': 'Illustrator',
            'license': 'by', 'license_version': '4.0',
            'foreign_landing_url': 'https://example.org/ear',
        }
        image = normalize_openverse_image(record)
        self.assertIsNotNone(image)
        self.assertTrue(image['target'].startswith('https://api.openverse.org/v1/images/'))
        for invalid in ({'license': 'all-rights-reserved'}, {'creator': ''},
                        {'id': '../unsafe'}, {'foreign_landing_url': 'https://[broken'}):
            with self.subTest(invalid=invalid):
                self.assertIsNone(normalize_openverse_image({**record, **invalid}))

    @patch('apps.classroom.services.visual_selection.get_llm')
    def test_selector_rejects_invalid_indices_and_non_object_response(self, get_llm):
        candidates = {'ear': [{'title': 'Ear', 'description': 'Labelled ear'}]}
        for content in ('[]', '{"ear": true}', '{"ear": 2}', '{"other": 1}', '{"ear": null}'):
            get_llm.return_value.invoke.return_value = SimpleNamespace(
                text=content, usage_metadata={'total_tokens': 7})
            with self.subTest(content=content):
                selected, tokens = select_concept_images(candidates, allow_ai=True)
                self.assertEqual(selected, {})
                self.assertEqual(tokens, 7)

    @patch('apps.classroom.services.visual_selection.get_llm')
    def test_no_candidates_does_not_call_llm(self, get_llm):
        self.assertEqual(select_concept_images({'ear': []}), ({}, 0))
        get_llm.assert_not_called()
