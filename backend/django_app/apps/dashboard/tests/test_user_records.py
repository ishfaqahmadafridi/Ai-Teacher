from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from apps.dashboard.models import CourseModel, AssignmentModel, LiveClassModel
from apps.dashboard.services import get_dashboard_overview, perform_global_search


class DashboardUserRecordsTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='student', email='student@example.com')
        self.other = get_user_model().objects.create_user(username='other', email='other@example.com')
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_new_account_has_no_seeded_records(self):
        overview = get_dashboard_overview(self.user)
        self.assertEqual(overview['courses'], [])
        self.assertEqual(overview['assignments'], [])
        self.assertEqual(overview['live_classes'], [])
        self.assertEqual(overview['courses_count'], 0)
        self.assertIsNone(overview['continue_learning'])
        self.assertEqual(CourseModel.objects.count(), 0)

    def test_other_users_and_legacy_records_are_excluded(self):
        for owner in [None, self.other]:
            CourseModel.objects.create(user=owner, title='Physics', subject_field='Physics', course_code='PHY')
            AssignmentModel.objects.create(user=owner, title='Physics quiz', subject='Physics', due_date='Tomorrow')
            LiveClassModel.objects.create(user=owner, title='Physics class', subject='Physics', instructor_name='Teacher', time_formatted='Tomorrow')
        own = CourseModel.objects.create(user=self.user, title='Physics', subject_field='Physics', course_code='PHY')
        overview = get_dashboard_overview(self.user)
        self.assertEqual(overview['courses'], [own])
        self.assertEqual(overview['assignments'], [])
        self.assertEqual(overview['live_classes'], [])
        results = perform_global_search('Physics', user=self.user)
        self.assertEqual([item['id'] for item in results['courses']], [str(own.pk)])
        self.assertEqual(results['assignments'], [])
        self.assertEqual(results['liveClasses'], [])

    def test_skipped_profile_cannot_register_course(self):
        response = self.client.post('/api/dashboard/courses/', {'title': 'Physics', 'subject_field': 'Physics', 'course_code': 'PHY'}, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(CourseModel.objects.count(), 0)

    def test_registration_requires_selected_field_and_preserves_progress(self):
        for field, value in {'first_name': 'Student', 'country': 'Pakistan', 'timezone': 'Asia/Karachi', 'preferred_language': 'English', 'education_level': 'undergraduate', 'academic_year': 'junior', 'selected_interests': ['Physics']}.items():
            setattr(self.user, field, value)
        self.user.save()
        payload = {'title': 'Physics', 'subject_field': 'Physics', 'course_code': 'PHY'}
        self.assertEqual(self.client.post('/api/dashboard/courses/', {**payload, 'subject_field': 'Unselected'}, format='json').status_code, 400)
        self.assertEqual(self.client.post('/api/dashboard/courses/', payload, format='json').status_code, 201)
        course = CourseModel.objects.get(user=self.user)
        listed = self.client.get('/api/dashboard/courses/')
        self.assertEqual(listed.status_code, 200)
        self.assertEqual([item['id'] for item in listed.data], [course.pk])
        overview = self.client.get('/api/dashboard/overview/')
        self.assertEqual(overview.status_code, 200)
        self.assertEqual(overview.data['courses_count'], 1)
        self.assertEqual([item['id'] for item in overview.data['courses']], [course.pk])
        course.progress_percent = 50
        course.save()
        self.client.post('/api/dashboard/courses/', payload, format='json')
        course.refresh_from_db()
        self.assertEqual(course.progress_percent, 50)
        self.assertEqual(CourseModel.objects.count(), 1)

    def test_dashboard_requires_authentication(self):
        self.client.force_authenticate(None)
        self.assertIn(self.client.get('/api/dashboard/courses/').status_code, [401, 403])

    def test_dashboard_timezone_save_preserves_learning_details(self):
        self.user.country = 'Pakistan'
        self.user.education_level = 'postgraduate'
        self.user.academic_year = 'junior'
        self.user.selected_interests = ['Physics']
        self.user.save()
        response = self.client.patch('/api/auth/me/', {'timezone': 'Asia/Karachi'}, format='json')
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.timezone, 'Asia/Karachi')
        self.assertEqual(self.user.country, 'Pakistan')
        self.assertEqual(self.user.selected_interests, ['Physics'])
        self.assertEqual(self.user.education_level, 'postgraduate')
        self.assertEqual(CourseModel.objects.filter(user=self.user).count(), 0)

    def test_profile_accepts_one_field_and_rejects_multiple_fields(self):
        response = self.client.patch('/api/auth/me/', {'selected_interests': ['Physics']}, format='json')
        self.assertEqual(response.status_code, 200)
        response = self.client.patch('/api/auth/me/', {'selected_interests': ['Physics', 'Biology']}, format='json')
        self.assertEqual(response.status_code, 400)
        self.user.refresh_from_db()
        self.assertEqual(self.user.selected_interests, ['Physics'])
