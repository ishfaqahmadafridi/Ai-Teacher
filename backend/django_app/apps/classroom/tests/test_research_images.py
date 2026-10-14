"""Image attribution, host boundaries and selection regressions."""
from django.test import SimpleTestCase
from apps.classroom.services.research_images import normalize_image
from apps.classroom.services.lesson_visuals import resolve_lesson_visuals
from apps.classroom.tests.test_lecture_notes import lesson_answer


def image_page():
    return {'title': 'File:Heart.svg', 'imageinfo': [{
        'mime': 'image/svg+xml', 'thumburl': 'https://upload.wikimedia.org/heart.png',
        'descriptionurl': 'https://commons.wikimedia.org/wiki/File:Heart.svg',
        'extmetadata': {'Artist': {'value': '<b>Example author</b>'},
                        'LicenseUrl': {'value': 'http://creativecommons.org/licenses/by/4.0/'},
                        'ImageDescription': {'value': 'Labelled heart chambers'}}}]}


class ResearchImageTests(SimpleTestCase):
    def test_credit_and_license(self):
        result = normalize_image(image_page())
        self.assertEqual(result['author'], 'Example author')
        self.assertTrue(result['license'].startswith('https://'))

    def test_untrusted_host(self):
        page = image_page()
        page['imageinfo'][0]['thumburl'] = 'https://evil.example/image.png'
        self.assertIsNone(normalize_image(page))

    def test_missing_license(self):
        page = image_page()
        page['imageinfo'][0]['extmetadata']['LicenseUrl']['value'] = ''
        self.assertIsNone(normalize_image(page))

    def test_selected_image_has_credit(self):
        answer = lesson_answer()
        answer['chunks'][0]['diagram']['image_ref'] = 1
        result = resolve_lesson_visuals(answer, [normalize_image(image_page())])
        self.assertEqual(result['diagram_type'], 'image')
        self.assertIn('Example author', result['chunks'][0]['diagram']['annotation'])

    def test_missing_candidate_never_fabricates_url(self):
        answer = lesson_answer()
        answer['chunks'][0]['diagram']['image_ref'] = 3
        result = resolve_lesson_visuals(answer, [])
        self.assertNotIn('target', result['chunks'][0]['diagram'])
