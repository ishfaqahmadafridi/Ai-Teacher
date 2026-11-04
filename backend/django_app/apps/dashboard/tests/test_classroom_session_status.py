"""Server-clock windows are private, read-only and tied to the admitted occurrence."""
from datetime import timedelta
from uuid import uuid4
from unittest.mock import patch
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from apps.dashboard.models import SessionAttendance, SessionOccurrence


class ClassroomSessionStatusTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='timed-class', email='timed@example.org')
        self.client = APIClient()
        self.client.force_authenticate(self.user)
        self.session_id = uuid4()
        self.start = timezone.now() + timedelta(minutes=1)
        self.end = self.start + timedelta(hours=1)
        self.url = f'/api/dashboard/timetable/sessions/{self.session_id}/join/'
        self.occurrence = SessionOccurrence.objects.create(
            user=self.user, session_id=self.session_id, session_date=self.start.date(),
            starts_at=self.start, ends_at=self.end, timezone='UTC', title='Ohm law', subject='Physics',
        )

    def admit(self):
        SessionAttendance.objects.create(user=self.user, session_id=self.session_id,
            session_date=self.start.date(), status='attended', joined_at=self.start - timedelta(minutes=2))

    def test_unadmitted_or_other_account_cannot_read_the_class(self):
        self.assertEqual(self.client.get(self.url).status_code, 404)
        self.admit()
        other = get_user_model().objects.create_user(username='other-timed', email='other-timed@example.org')
        self.client.force_authenticate(other)
        self.assertEqual(self.client.get(self.url).status_code, 404)

    def test_read_returns_server_time_and_does_not_modify_attendance(self):
        self.admit()
        for now in [self.start - timedelta(minutes=1), self.start, self.end, self.end + timedelta(days=7)]:
            with self.subTest(now=now), patch('apps.dashboard.services.classroom_session_status.timezone.now', return_value=now):
                response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data['startsAt'], self.start.isoformat().replace('+00:00', 'Z'))
            self.assertEqual(response.data['endsAt'], self.end.isoformat().replace('+00:00', 'Z'))
            self.assertIsNone(response.data['noteId'])
        self.assertEqual(SessionAttendance.objects.count(), 1)

    def test_anonymous_access_is_rejected(self):
        self.client.force_authenticate(None)
        self.assertEqual(self.client.get(self.url).status_code, 401)
