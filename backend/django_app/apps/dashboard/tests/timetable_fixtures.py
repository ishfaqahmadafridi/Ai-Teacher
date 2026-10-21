"""Shared setup for focused backend regression suites."""
from django.contrib.auth import get_user_model
from django.core.cache import cache
from rest_framework.test import APIClient
from apps.dashboard.models import CourseModel

class TimetableFixture:
    def setUp(self):
        cache.clear()
        self.user = get_user_model().objects.create_user(username='planner', email='planner@example.com')
        self.client = APIClient()
        self.client.force_authenticate(self.user)
        self.preferences = dict(start_time='09:00', end_time='12:30', days=['Monday', 'Tuesday'], max_classes=2, session_minutes=90, break_minutes=30, timezone='Asia/Karachi')
        self.course = CourseModel.objects.create(user=self.user, title='Algorithms', course_code='CS', subject_field='Computer Science')
        self.inputs = dict(courses=[dict(id=self.course.pk, title=self.course.title)], preferences=self.preferences)
