"""Scheduled lesson scope, student level and fail-closed coverage checks."""
import json
from datetime import datetime, timezone
from uuid import uuid4
from unittest.mock import Mock, patch
from django.contrib.auth import get_user_model
from django.test import TestCase, SimpleTestCase
from rest_framework.exceptions import PermissionDenied
from rest_framework.test import APIClient
from langchain_core.messages import AIMessage
from apps.dashboard.models import SavedTimetable, SessionAttendance
from apps.classroom.models.lesson_job import LessonJob
from apps.classroom.services.lesson_jobs import submit_lesson_job, run_lesson_job
from apps.classroom.services.curriculum_coverage import CurriculumCoverageError, validate_curriculum_coverage, review_curriculum_coverage
from apps.classroom.inference.pipeline import generate_answer


class ScheduledCurriculumTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='curriculum-student', education_level='primary', grade_level='Grade 4')
        self.session_id = uuid4()
        self.now = datetime(2030, 1, 1, 9, 20, tzinfo=timezone.utc)
        self.item = dict(id=str(self.session_id), title='Plants', subject='Science', sessionDate='2030-01-01',
                         planStartDate='2030-01-01', weekNumber=1, startTime='09:00', endTime='10:30', timezone='UTC',
                         subtopics=['Roots', 'Leaves'], exercises=['Draw a plant'])
        SavedTimetable.objects.create(user=self.user, schedule=[self.item])
        SessionAttendance.objects.create(user=self.user, session_id=self.session_id, session_date='2030-01-01', status='attended')
        self.inputs = dict(question='Teach the scheduled lesson', session_id='curriculum-conversation', scheduled_session_id=str(self.session_id))

    def submit(self, inputs=None):
        with patch('django.utils.timezone.now', return_value=self.now):
            return submit_lesson_job(self.user, uuid4(), inputs or self.inputs)

    def test_backend_resolves_saved_scope_and_level_even_for_short_question(self):
        job = self.submit()
        self.assertEqual(job.inputs['curriculum']['course'], 'Science')
        self.assertEqual([item['label'] for item in job.inputs['curriculum']['requirements']], ['Plants', 'Roots', 'Leaves', 'Draw a plant'])
        self.assertEqual(job.inputs['student_context']['level'], 'Primary school')
        self.assertEqual(job.inputs['student_context']['grade'], 'Grade 4')
        self.assertIn('very simple', job.inputs['student_context']['guidance'])

    def test_ownership_attendance_and_time_are_required(self):
        with self.assertRaises(PermissionDenied):
            self.submit({**self.inputs, 'scheduled_session_id': str(uuid4())})
        SessionAttendance.objects.all().delete()
        with self.assertRaises(PermissionDenied):
            self.submit()

    def test_large_saved_quiz_scope_does_not_expand_the_question(self):
        saved = SavedTimetable.objects.get(user=self.user)
        saved.schedule[0]['subtopics'] = [f'Topic {index}: ' + 'Detailed course concepts ' * 8 for index in range(50)]
        saved.save()
        job = self.submit()
        self.assertLess(len(job.inputs['question']), 2000)
        self.assertEqual(len(job.inputs['curriculum']['requirements']), 52)

    def test_api_ignores_fabricated_scope_and_level_from_the_browser(self):
        client = APIClient()
        client.force_authenticate(self.user)
        with patch('django.utils.timezone.now', return_value=self.now):
            response = client.post('/api/lesson-jobs/', {**self.inputs, 'request_id': str(uuid4()),
                'curriculum': {'course': 'Fake'}, 'student_context': {'level': 'Postgraduate'}}, format='json')
        self.assertEqual(response.status_code, 202, response.data)
        job = LessonJob.objects.get(pk=response.data['id'])
        self.assertEqual(job.inputs['curriculum']['course'], 'Science')
        self.assertEqual(job.inputs['student_context']['level'], 'Primary school')

    def test_joined_student_cannot_submit_after_class_ends(self):
        self.now = datetime(2030, 1, 1, 10, 30, tzinfo=timezone.utc)
        with self.assertRaises(PermissionDenied):
            self.submit()

    def test_missing_coverage_cannot_be_published_as_ready(self):
        job = self.submit()
        with patch('apps.classroom.services.lesson_provider_admission.provider_delay', return_value=0), patch('apps.classroom.services.lesson_jobs.generate_answer', return_value={'topic': 'Plants', 'chunks': [], 'model_info': {}}):
            run_lesson_job(str(job.pk))
        job.refresh_from_db()
        self.assertNotEqual(job.status, 'ready')
        self.assertEqual(job.result, {})

    def test_followup_keeps_scope_without_requiring_the_entire_lesson_again(self):
        first = self.submit()
        LessonJob.objects.filter(pk=first.pk).update(status='ready', result={'model_info': {'curriculum_verified': True}})
        followup = self.submit({**self.inputs, 'question': 'Explain roots more simply'})
        answer = dict(topic='Roots', language='en', diagram_type='default', model_info={}, chunks=[dict(speak='Roots take water from the soil.', key_point='Roots', diagram={})])
        with patch('apps.classroom.services.lesson_provider_admission.provider_delay', return_value=0), patch('apps.classroom.services.lesson_jobs.generate_answer', return_value=answer) as generate:
            run_lesson_job(str(followup.pk))
        self.assertFalse(generate.call_args.kwargs['require_curriculum_coverage'])
        self.assertEqual(generate.call_args.kwargs['curriculum']['course'], 'Science')
        followup.refresh_from_db()
        self.assertEqual(followup.status, 'ready')


class CurriculumCoverageTests(SimpleTestCase):
    def setUp(self):
        self.context = dict(session_id=str(uuid4()), requirements=[dict(id='concept-0', kind='concept', label='Roots')])
        self.answer = dict(topic='Plants', language='en', chunks=[dict(curriculum_ids=['concept-0'], key_point='Roots', speak='Roots absorb water and minerals from the soil.', diagram={})])

    def test_ids_require_real_narration_and_matching_labels(self):
        self.assertEqual(validate_curriculum_coverage(self.answer, self.context), ['concept-0'])
        for chunk in [dict(curriculum_ids=[], key_point='Roots', speak='Roots absorb water from soil.'), dict(curriculum_ids=['concept-0'], key_point='Leaves', speak='Leaves make food using sunlight.'), dict(curriculum_ids=['concept-0'], key_point='Roots', speak='Roots'), dict(curriculum_ids=['invented'], key_point='Roots', speak='Roots absorb water from the soil.')]:
            with self.assertRaises(CurriculumCoverageError):
                validate_curriculum_coverage({'chunks': [chunk]}, self.context)

    def test_pipeline_sends_level_and_marks_only_validated_coverage(self):
        llm = Mock()
        llm.invoke.side_effect = [AIMessage(content=json.dumps(self.answer)), AIMessage(content=json.dumps({'level_appropriate': True, 'findings': [{'requirement_id': 'concept-0', 'covered': True, 'evidence': self.answer['chunks'][0]['speak']}]}))]
        with patch('apps.classroom.inference.pipeline.get_llm', return_value=llm), patch('apps.classroom.rag.search', return_value=''), patch('apps.classroom.inference.pipeline.get_session', return_value=[]), patch('apps.classroom.services.lesson_visuals.resolve_lesson_visuals', side_effect=lambda answer, images: answer):
            result = generate_answer('Teach this class', curriculum=self.context, student_context={'level': 'Primary school', 'guidance': 'Use simple words.'}, require_curriculum_coverage=True, persist_history=False)
        self.assertTrue(result['model_info']['curriculum_verified'])
        self.assertEqual(result['model_info']['curriculum_coverage'], ['concept-0'])
        prompt = llm.invoke.call_args_list[0].args[0][0].content
        self.assertIn('Primary school', prompt)
        self.assertIn('Roots', prompt)

    def test_independent_review_rejects_missing_or_fabricated_evidence(self):
        for finding in [dict(requirement_id='concept-0', covered=False, evidence='Roots absorb water from soil.'), dict(requirement_id='concept-0', covered=True, evidence='This explanation does not appear anywhere in the narration.')]:
            llm = Mock()
            llm.invoke.return_value = AIMessage(content=json.dumps(dict(level_appropriate=True, findings=[finding])))
            with self.assertRaises(CurriculumCoverageError):
                review_curriculum_coverage(llm, self.answer, self.context, {'level': 'Primary school'})

    def test_review_rejects_teaching_above_the_student_level(self):
        llm = Mock()
        llm.invoke.return_value = AIMessage(content=json.dumps(dict(level_appropriate=False, findings=[dict(requirement_id='concept-0', covered=True, evidence=self.answer['chunks'][0]['speak'])])))
        with self.assertRaises(CurriculumCoverageError):
            review_curriculum_coverage(llm, self.answer, self.context, {'level': 'Primary school'})
