"""
Course memory: the teacher recalls this student's previous classes in the same course only.

WHY THESE TESTS:
    Memory must be built from evidence (graded answers, the student's own questions), stay small,
    and never mix courses or students. These tests pin each of those properties.
"""
import json
from datetime import datetime, timezone
from unittest.mock import patch
from uuid import uuid4
from django.contrib.auth import get_user_model
from django.test import SimpleTestCase, TestCase
from apps.classroom.constants.lesson import (
    COURSE_MEMORY_CLASSES, COURSE_MEMORY_ITEMS, COURSE_MEMORY_TEXT_LENGTH,
)
from apps.classroom.models.lesson_attempt import LessonAttempt, LessonProgress
from apps.classroom.services.course_memory import previous_classes
from apps.classroom.services.lecture_notes import save_lecture_note
from apps.classroom.services.teaching_messages import teaching_messages
from apps.classroom.utilities.course_memory import clip_items, normalize_course_key
from apps.dashboard.models import SavedTimetable, SessionAttendance


def class_answer(topic, check='What does the discriminant tell us?', key_point='Roots of a quadratic'):
    return {'topic': topic, 'language': 'en', 'diagram_type': 'default', 'chunks': [
        {'speak': f'Today we learn {topic}.', 'key_point': key_point, 'diagram': {'action': 'none'}},
        {'speak': check, 'question': check, 'expected_concepts': ['Number and type of roots'], 'diagram': {'action': 'none'}},
        {'speak': 'Next we practise.', 'diagram': {'action': 'none'}},
        {'speak': 'Any questions?', 'discussion_prompt': 'Any questions?', 'diagram': {'action': 'none'}},
        {'speak': 'That is all for today.', 'diagram': {'action': 'none'}},
    ]}


class CourseMemoryTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='memory-student', email='memory@example.org')

    def save_class(self, topic, course='Mathematics', session=None, user=None, **answer):
        session = session or str(uuid4())
        return save_lecture_note(user or self.user, f'conversation-{session}', class_answer(topic, **answer),
                                 course_label=course, scheduled_session_id=session)

    def attempt(self, note, section, answer, outcome=None, missing=(), reply=None):
        evaluation = {'reply': reply} if reply else ({'outcome': outcome, 'missing_concepts': list(missing)} if outcome else {})
        return LessonAttempt.objects.create(note=note, request_id=uuid4(), section_index=section,
                                            question=note.answer['chunks'][section].get('question', 'Any questions?'),
                                            answer=answer, evaluation=evaluation)

    def test_scheduled_note_records_its_normalized_course(self):
        note = self.save_class('Quadratic roots', course='  Mathematics  101 ')
        self.assertEqual(note.course_key, 'mathematics 101')
        self.assertTrue(note.scheduled_session_id)

    def test_recalls_only_the_same_course_and_never_the_current_class(self):
        current = str(uuid4())
        self.save_class('Quadratic roots')
        self.save_class('Newton laws', course='Physics')
        self.save_class('Current lesson', session=current)
        memory = previous_classes(self.user, 'mathematics', current)
        self.assertEqual([item['topic'] for item in memory], ['Quadratic roots'])

    def test_other_students_classes_never_appear(self):
        other = get_user_model().objects.create_user(username='memory-other', email='memory-other@example.org')
        self.save_class('Someone else', user=other)
        self.assertEqual(previous_classes(self.user, 'Mathematics', uuid4()), [])

    def test_keeps_the_most_recent_classes_oldest_first(self):
        for topic in ['Week 1', 'Week 2', 'Week 3']:
            self.save_class(topic)
        memory = previous_classes(self.user, 'Mathematics', uuid4())
        self.assertEqual(len(memory), COURSE_MEMORY_CLASSES)
        self.assertEqual([item['topic'] for item in memory], ['Week 2', 'Week 3'])

    def test_weak_points_come_only_from_graded_evidence(self):
        note = self.save_class('Quadratic roots')
        self.attempt(note, 1, 'It gives the roots', 'misconception', ['Number and type of roots'])
        summary = previous_classes(self.user, 'Mathematics', uuid4())[0]
        self.assertEqual(summary['weak_points'], ['What does the discriminant tell us? (missed: Number and type of roots)'])
        self.assertEqual(summary['covered'], ['Roots of a quadratic'])

    def test_a_later_correct_answer_clears_the_weak_point(self):
        note = self.save_class('Quadratic roots')
        self.attempt(note, 1, 'It gives the roots', 'misconception', ['Number and type of roots'])
        self.attempt(note, 1, 'How many real roots exist', 'understood')
        self.assertEqual(previous_classes(self.user, 'Mathematics', uuid4())[0]['weak_points'], [])

    def test_a_later_doubt_on_the_same_check_does_not_clear_the_weak_point(self):
        note = self.save_class('Quadratic roots')
        self.attempt(note, 1, 'It gives the roots', 'misconception', ['Number and type of roots'])
        self.attempt(note, 1, 'why b squared minus 4ac?', 'student_question')
        summary = previous_classes(self.user, 'Mathematics', uuid4())[0]
        self.assertEqual(len(summary['weak_points']), 1)
        self.assertEqual(summary['open_doubts'], ['why b squared minus 4ac?'])

    def test_open_doubts_are_the_students_own_questions(self):
        note = self.save_class('Quadratic roots')
        self.attempt(note, 1, 'why b squared minus 4ac?', 'student_question')
        self.attempt(note, 3, 'Can roots be imaginary?', reply='Yes, when the discriminant is negative.')
        self.attempt(note, 1, 'not graded yet')
        doubts = previous_classes(self.user, 'Mathematics', uuid4())[0]['open_doubts']
        self.assertEqual(sorted(doubts), ['Can roots be imaginary?', 'why b squared minus 4ac?'])

    def test_completion_follows_saved_progress(self):
        note = self.save_class('Quadratic roots')
        self.assertFalse(previous_classes(self.user, 'Mathematics', uuid4())[0]['completed'])
        LessonProgress.objects.update_or_create(note=note, defaults={'section_index': 4})
        self.assertTrue(previous_classes(self.user, 'Mathematics', uuid4())[0]['completed'])

    def test_lists_are_capped_and_truncated_for_the_context_budget(self):
        note = self.save_class('Quadratic roots')
        for index in range(COURSE_MEMORY_ITEMS + 3):
            self.attempt(note, 3, f'doubt {index} ' + 'x' * 500, reply='ok')
        doubts = previous_classes(self.user, 'Mathematics', uuid4())[0]['open_doubts']
        self.assertEqual(len(doubts), COURSE_MEMORY_ITEMS)
        self.assertTrue(all(len(item) <= COURSE_MEMORY_TEXT_LENGTH for item in doubts))

    def test_ad_hoc_lessons_and_blank_courses_have_no_memory(self):
        save_lecture_note(self.user, 'ad-hoc', class_answer('Free question'))
        self.assertEqual(previous_classes(self.user, 'Mathematics', uuid4()), [])
        self.assertEqual(previous_classes(self.user, '', uuid4()), [])

    def test_memory_never_contains_identity(self):
        note = self.save_class('Quadratic roots')
        self.attempt(note, 1, 'answer', 'unclear')
        text = json.dumps(previous_classes(self.user, 'Mathematics', uuid4()))
        self.assertNotIn(self.user.email, text)
        self.assertNotIn(self.user.username, text)


class CourseMemoryPromptTests(SimpleTestCase):
    MEMORY = [{'topic': 'Quadratic roots', 'completed': True, 'covered': ['Roots'],
               'weak_points': ['Discriminant'], 'open_doubts': []}]

    def test_previous_classes_instruction_is_added_only_with_memory(self):
        with_memory = teaching_messages('Nature of roots', [], {'previous_classes': self.MEMORY})
        without = teaching_messages('Nature of roots', [], {})
        self.assertIn('PREVIOUS CLASSES', with_memory[0].content)
        self.assertIn('Quadratic roots', with_memory[-2].content)
        self.assertNotIn('PREVIOUS CLASSES', without[0].content)

    def test_course_key_and_clipping_helpers(self):
        self.assertEqual(normalize_course_key('  Physics\t101 '), 'physics 101')
        self.assertEqual(normalize_course_key(None), '')
        self.assertEqual(clip_items(['a  b', 'a b', '', 'c' * 9], 5, 4), ['a b', 'cccc'])


class CourseMemoryJobTests(TestCase):
    """The scheduled-class job carries memory, and saved classes feed the next one."""

    def setUp(self):
        self.user = get_user_model().objects.create_user(username='memory-job', education_level='high_school')
        self.now = datetime(2030, 1, 8, 9, 20, tzinfo=timezone.utc)
        self.previous, self.current = str(uuid4()), str(uuid4())
        item = dict(subject='Mathematics', planStartDate='2030-01-01', startTime='09:00', endTime='10:30',
                    timezone='UTC', subtopics=['Discriminant'], exercises=[])
        SavedTimetable.objects.create(user=self.user, schedule=[
            {**item, 'id': self.previous, 'title': 'Quadratic roots', 'sessionDate': '2030-01-01', 'weekNumber': 1},
            {**item, 'id': self.current, 'title': 'Nature of roots', 'sessionDate': '2030-01-08', 'weekNumber': 2},
        ])
        SessionAttendance.objects.create(user=self.user, session_id=self.current, session_date='2030-01-08', status='attended')
        save_lecture_note(self.user, 'week-1', class_answer('Quadratic roots'), course_label='Mathematics',
                          scheduled_session_id=self.previous)

    def submit(self, request_id=None):
        from apps.classroom.services.lesson_jobs import submit_lesson_job
        inputs = dict(question='Teach the scheduled lesson', session_id='week-2', scheduled_session_id=self.current)
        with patch('django.utils.timezone.now', return_value=self.now):
            return submit_lesson_job(self.user, request_id or uuid4(), inputs)

    def test_job_inputs_carry_last_class_of_this_course(self):
        job = self.submit()
        self.assertEqual([item['topic'] for item in job.inputs['course_memory']], ['Quadratic roots'])

    def test_retry_with_the_same_request_is_not_rejected_by_server_added_memory(self):
        request_id = uuid4()
        first = self.submit(request_id)
        self.assertEqual(self.submit(request_id).pk, first.pk)
