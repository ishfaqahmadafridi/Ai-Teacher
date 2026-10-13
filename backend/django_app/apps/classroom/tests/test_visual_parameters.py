"""Bounded physical visual values; no zero-resistance or nonfinite circuits."""
from django.test import SimpleTestCase
from apps.classroom.serializers.ask_serializers import GeneratedAnswerSerializer
from apps.classroom.tests.test_lecture_notes import lesson_answer


class CircuitParameterTests(SimpleTestCase):
    def validate_parameters(self, parameters):
        answer = lesson_answer()
        answer['chunks'][0]['diagram']['parameters'] = parameters
        serializer = GeneratedAnswerSerializer(data=answer)
        return serializer.is_valid()

    def test_valid_example_is_accepted(self):
        self.assertTrue(self.validate_parameters({'voltage': 12, 'resistance': 4}))

    def test_zero_resistance_is_rejected(self):
        self.assertFalse(self.validate_parameters({'voltage': 12, 'resistance': 0}))

    def test_nonfinite_voltage_is_rejected(self):
        self.assertFalse(self.validate_parameters({'voltage': float('nan'), 'resistance': 4}))
