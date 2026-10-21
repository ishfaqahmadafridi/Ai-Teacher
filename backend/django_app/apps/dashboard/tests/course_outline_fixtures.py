"""Shared setup for focused backend regression suites."""
from django.contrib.auth import get_user_model
from django.core.cache import cache
from rest_framework.test import APIClient
from apps.dashboard.models import CourseModel

class CourseOutlineFixture:
    def setUp(self):
        cache.clear()
        self.user = get_user_model().objects.create_user(username='outline-owner', email='owner@example.invalid', education_level='undergraduate')
        self.other = get_user_model().objects.create_user(username='outline-other', email='other@example.invalid')
        self.client = APIClient()
        self.client.force_authenticate(self.user)
        self.course = CourseModel.objects.create(user=self.user, title='Algorithms', course_code='CS101', subject_field='Computer Science')
        self.url = f'/api/dashboard/courses/{self.course.pk}/outline/'
        self.preferences = dict(start_time='09:00', end_time='12:30', days=['Monday', 'Tuesday'], max_classes=2, session_minutes=90, break_minutes=30, timezone='Asia/Karachi')
