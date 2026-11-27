"""
One subject's teaching method per lesson, chosen by code.

WHY THESE TESTS:
    A maths class must never receive physics or medicine rules (AI rule AI-8), and the choice
    must come from saved data first (AI-6). These tests pin the selection and the prompt contents.
"""
from django.test import SimpleTestCase
from apps.classroom.constants.subjects import GENERAL_SUBJECT, MAX_LESSON_SUBJECTS, SUBJECTS, SUBJECT_TOPIC_HINTS
from apps.classroom.prompts.subject_teaching_prompt import SUBJECT_TEACHING_RULES
from apps.classroom.prompts.teaching_quality_prompt import TEACHING_DEPTH_PROMPT
from apps.classroom.services.teaching_messages import teaching_messages
from apps.classroom.utilities.subject_resolution import resolve_lesson_subjects, subject_from_course, subjects_from_topic


class SubjectResolutionTests(SimpleTestCase):
    def test_course_names_from_different_institutions_reach_one_subject(self):
        for label, subject in [('FSc Mathematics Part 1', 'mathematics'), ('Maths', 'mathematics'), ('Bio', 'biology'),
                               ('MBBS Neuroanatomy', 'medicine'), ('BSCS Data Structures', 'computer_science'),
                               ('Physics', 'physics'), ('Organic Chemistry', 'chemistry'),
                               ('Mechanical Engineering', 'engineering')]:
            with self.subTest(label=label):
                self.assertEqual(subject_from_course(label), subject)

    def test_specific_fields_win_over_broad_ones(self):
        self.assertEqual(subject_from_course('Human anatomy for biology students'), 'medicine')
        self.assertEqual(subject_from_course('Electrical engineering physics'), 'engineering')

    def test_unknown_or_empty_course_names_no_subject(self):
        self.assertIsNone(subject_from_course('Pakistan Studies'))
        self.assertIsNone(subject_from_course(''))
        self.assertIsNone(subject_from_course(None))

    def test_words_inside_other_words_do_not_match(self):
        self.assertIsNone(subject_from_course('Physical education'))
        self.assertIsNone(subject_from_course('Biography'))

    def test_course_label_decides_even_when_the_topic_sounds_different(self):
        self.assertEqual(resolve_lesson_subjects('Mathematics', 'projectile motion force gravity'), ('mathematics',))

    def test_ad_hoc_topics_use_hints_and_ambiguity_keeps_at_most_two(self):
        self.assertEqual(resolve_lesson_subjects('', 'explain the mid brain'), ('medicine',))
        self.assertEqual(resolve_lesson_subjects('', 'solve this quadratic equation'), ('mathematics',))
        mixed = subjects_from_topic('force on a molecule: bond reaction energy velocity momentum cell')
        self.assertEqual(len(mixed), MAX_LESSON_SUBJECTS)
        self.assertEqual(mixed, ['physics', 'chemistry'], 'strongest matches first; weaker biology dropped')

    def test_nothing_matching_gets_general_rules_never_another_subject(self):
        self.assertEqual(resolve_lesson_subjects('', 'tell me about the Mughal empire'), (GENERAL_SUBJECT,))

    def test_every_subject_has_teaching_rules_and_hints(self):
        for subject in SUBJECTS:
            self.assertIn(subject, SUBJECT_TEACHING_RULES)
            self.assertIn(subject, SUBJECT_TOPIC_HINTS)
        self.assertIn(GENERAL_SUBJECT, SUBJECT_TEACHING_RULES)


class SubjectPromptIsolationTests(SimpleTestCase):
    def policy(self, question, course=None):
        context = {'scheduled_lesson': {'course': course, 'topic': question}} if course else {}
        return teaching_messages(question, [], context)[0].content

    def test_maths_class_gets_only_mathematics_rules(self):
        policy = self.policy('Nature of roots', course='FSc Mathematics')
        self.assertIn(SUBJECT_TEACHING_RULES['mathematics'], policy)
        for other in ('physics', 'medicine', 'biology', 'chemistry', 'computer_science', 'engineering', 'general'):
            self.assertNotIn(SUBJECT_TEACHING_RULES[other], policy, other)

    def test_mbbs_anatomy_class_gets_only_medicine_rules(self):
        policy = self.policy('The midbrain', course='MBBS Neuroanatomy')
        self.assertIn(SUBJECT_TEACHING_RULES['medicine'], policy)
        self.assertNotIn(SUBJECT_TEACHING_RULES['mathematics'], policy)
        self.assertNotIn(SUBJECT_TEACHING_RULES['physics'], policy)

    def test_depth_prompt_no_longer_carries_any_subject_method(self):
        for rules in SUBJECT_TEACHING_RULES.values():
            self.assertNotIn(rules.strip()[:40], TEACHING_DEPTH_PROMPT)

    def test_exactly_one_subject_method_section_is_sent(self):
        policy = self.policy('Nature of roots', course='Mathematics')
        self.assertEqual(policy.count('SUBJECT METHOD (teach'), 1)
        self.assertEqual(sum(rules in policy for rules in SUBJECT_TEACHING_RULES.values()), 1)
