"""Real byte validation, stored delivery, and structural visual contracts."""
import hashlib
from io import BytesIO
from tempfile import TemporaryDirectory
from PIL import Image
from django.test import SimpleTestCase, override_settings
from apps.classroom.services.visual_assets import normalized_image, asset_path
from apps.classroom.serializers.structured_visual_serializers import StructuredVisualSerializer
from apps.classroom.serializers.ask_serializers import GeneratedAnswerSerializer

class VisualAssetTests(SimpleTestCase):
    def test_corrupt_file_rejected(self):
        with self.assertRaises(Exception):
            normalized_image(b'<html>error</html>')

    def test_png_stored_and_served(self):
        source = BytesIO()
        Image.new('RGB', (300, 200)).save(source, format='PNG')
        data = normalized_image(source.getvalue())
        digest = hashlib.sha256(data).hexdigest()
        with TemporaryDirectory() as directory, override_settings(MEDIA_ROOT=directory):
            path = asset_path(digest)
            path.parent.mkdir()
            path.write_bytes(data)
            response = self.client.get(f'/api/visual-assets/{digest}/')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(b''.join(response.streaming_content), data)
            response.close()

    def test_path_traversal_rejected(self):
        with self.assertRaises(ValueError):
            asset_path('../secret')

    def test_visual_contracts(self):
        self.assertTrue(StructuredVisualSerializer(data={'kind':'polynomial','coefficients':[0,0,1],'x_min':-5,'x_max':5}).is_valid())
        self.assertFalse(StructuredVisualSerializer(data={'kind':'tree','nodes':[{'id':'a','label':'A','parent':'a'}]}).is_valid())

    def test_flat_model_visual_is_normalized(self):
        serializer = GeneratedAnswerSerializer(data={'topic':'Graph','chunks':[{'speak':'A parabola','diagram':{'action':'none','kind':'polynomial','coefficients':[0,0,1],'x_min':-3,'x_max':3,'image_query':'parabola'}}]})
        self.assertTrue(serializer.is_valid())
        diagram = serializer.validated_data['chunks'][0]['diagram']
        self.assertEqual(diagram['visual']['kind'], 'polynomial')
        self.assertNotIn('image_query', diagram)
