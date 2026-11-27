"""Deterministic repairs keep good lessons instead of discarding them on label slips."""
from django.test import SimpleTestCase
from apps.classroom.services.teaching_structure import validate_teaching_structure, TeachingQualityError
from apps.classroom.tests.lecture_note_fixtures import quality_lesson
from apps.classroom.utilities.teaching_metadata import normalize_teaching_metadata


class TeachingMetadataRepairTests(SimpleTestCase):
    def test_stage_specific_concept_id_is_attached_to_its_explained_block(self):
        answer = quality_lesson()
        answer['chunks'][2]['concept_id'] = 'roots_example'
        answer['chunks'][5]['concept_id'] = 'roots_practice'
        with self.assertRaises(TeachingQualityError):
            validate_teaching_structure(answer)
        validate_teaching_structure(normalize_teaching_metadata(answer))
        self.assertEqual({answer['chunks'][i]['concept_id'] for i in (2, 5)}, {'roots'})

    def test_concept_id_explained_later_is_not_relabelled(self):
        answer = quality_lesson()
        answer['chunks'][2]['concept_id'] = 'shoots'
        answer['chunks'][4].update(concept_id='shoots')
        normalize_teaching_metadata(answer)
        self.assertEqual(answer['chunks'][2]['concept_id'], 'shoots')

    def test_invitation_touching_a_graded_check_moves_without_losing_narration(self):
        answer = quality_lesson()
        chunks = answer['chunks']
        invitation = chunks.pop(3)
        chunks.insert(4, invitation)  # now directly before the practice check
        speeches = sorted(c['speak'] for c in chunks)
        with self.assertRaises(TeachingQualityError):
            validate_teaching_structure(answer)
        validate_teaching_structure(normalize_teaching_metadata(answer))
        self.assertEqual(sorted(c['speak'] for c in answer['chunks']), speeches)


class ReviewEvidenceTests(SimpleTestCase):
    chunks = [{'speak': 'Intro.'}, {'speak': 'Within the tegmentum,  you’ll find the substantia nigra, which produces dopamine.'}]

    def test_cosmetic_differences_and_wrong_index_still_locate_real_narration(self):
        from apps.classroom.utilities.review_evidence import locate_evidence
        self.assertEqual(locate_evidence(self.chunks, "Within the tegmentum, you'll find the substantia nigra...", 0), 1)

    def test_invented_or_trivial_quotes_are_rejected(self):
        from apps.classroom.utilities.review_evidence import locate_evidence
        self.assertIsNone(locate_evidence(self.chunks, 'The midbrain controls breathing rhythm.', 1))
        self.assertIsNone(locate_evidence(self.chunks, 'Intro.', 0))


class LessonDepthTests(SimpleTestCase):
    def test_shallow_full_lesson_is_sent_back_with_specific_counts(self):
        from apps.classroom.services.teaching_structure import validate_lesson_depth
        with self.assertRaisesMessage(TeachingQualityError, '1 concept blocks'):
            validate_lesson_depth(quality_lesson())

    def test_deep_lesson_and_non_lesson_modes_pass(self):
        from apps.classroom.services.teaching_structure import validate_lesson_depth
        answer = quality_lesson()
        for concept in ('a', 'b', 'c'):
            answer['chunks'].insert(1, {'speak': 'word ' * 220, 'teaching_step': 'explanation', 'concept_id': concept, 'diagram': {}})
        validate_lesson_depth(answer)
        validate_lesson_depth({**quality_lesson(), 'lesson_mode': 'focused'})
