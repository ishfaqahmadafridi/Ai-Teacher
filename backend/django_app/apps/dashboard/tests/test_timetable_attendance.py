"""Focused regression coverage; shared setup lives in the fixture module."""
from unittest.mock import patch
from django.contrib.auth import get_user_model
from django.test import TestCase
from apps.dashboard.models import SavedTimetable
from .timetable_fixtures import TimetableFixture


class TimetableAttendanceTests(TimetableFixture, TestCase):
    def test_join_is_time_checked_and_attendance_persists_per_occurrence(self):
        from uuid import uuid4
        from datetime import datetime, timezone as tz
        from apps.dashboard.models import SessionAttendance
        session_id = str(uuid4())
        item = dict(id=session_id, title='Sorting', dayOfWeek='Monday', startTime='09:00', endTime='10:30', timezone='Asia/Karachi', status='upcoming', activeFrom='2026-10-11T00:00:00+00:00')
        SavedTimetable.objects.create(user=self.user, schedule=[item])
        route = f'/api/dashboard/timetable/sessions/{session_id}/join/'
        at = lambda hour, minute=0: datetime(2026, 10, 12, hour, minute, tzinfo=tz.utc)
        with patch('apps.dashboard.services.session_join_service.timezone.now', return_value=at(3, 56)):
            self.assertEqual(self.client.post(route).status_code, 409)
        with patch('apps.dashboard.services.session_join_service.timezone.now', return_value=at(4)):
            self.assertEqual(self.client.post(route).status_code, 200)
            self.assertEqual(self.client.post(route).status_code, 200)
        self.assertEqual(SessionAttendance.objects.count(), 1)
        with patch('apps.dashboard.services.session_join_service.timezone.now', return_value=at(5, 30)):
            self.assertEqual(self.client.post(route).status_code, 409)
        saved = SavedTimetable.objects.get(user=self.user)
        from apps.dashboard.services.session_attendance import schedule_with_attendance
        self.assertEqual(schedule_with_attendance(saved, self.user, at(6))[0]['attendance'], 'attended')
        following_monday = datetime(2026, 10, 19, 6, tzinfo=tz.utc)
        from apps.dashboard.services.attendance_reconciliation import reconcile_timetable
        reconcile_timetable(saved.pk, following_monday)
        self.assertEqual(schedule_with_attendance(saved, self.user, following_monday)[0]['attendance'], 'missed')
        missed = SessionAttendance.objects.get(user=self.user, session_id=session_id, session_date=following_monday.date())
        self.assertEqual(missed.status, 'missed')
        self.assertIsNone(missed.joined_at)
        schedule_with_attendance(saved, self.user, following_monday)
        self.assertEqual(SessionAttendance.objects.count(), 2)
        other = get_user_model().objects.create_user(username='attendance-other')
        self.client.force_authenticate(other)
        self.assertEqual(self.client.post(route).status_code, 404)


    def test_sessions_before_registration_are_not_marked_missed(self):
        from uuid import uuid4
        from datetime import datetime, timezone as tz
        from apps.dashboard.services.session_attendance import schedule_with_attendance
        item = dict(id=str(uuid4()), dayOfWeek='Monday', startTime='09:00', endTime='10:30', timezone='UTC', activeFrom='2026-10-13T00:00:00+00:00')
        saved = SavedTimetable.objects.create(user=self.user, schedule=[item])
        self.assertEqual(schedule_with_attendance(saved, self.user, datetime(2026, 10, 14, tzinfo=tz.utc))[0]['attendance'], 'unmarked')


    def test_reads_preserve_explicit_timezone_and_do_not_write_attendance(self):
        from uuid import uuid4
        from datetime import datetime, timezone as tz
        from apps.dashboard.services.session_attendance import schedule_with_attendance
        from apps.dashboard.models import SessionAttendance
        self.user.country, self.user.timezone = 'Pakistan', 'America/New_York'
        self.user.save()
        item = dict(id=str(uuid4()), dayOfWeek='Thursday', startTime='11:00', endTime='12:30', timezone='America/New_York', activeFrom='2026-10-01T00:00:00+00:00')
        saved = SavedTimetable.objects.create(user=self.user, schedule=[item])
        result = schedule_with_attendance(saved, self.user, datetime(2026, 10, 8, 14, 22, tzinfo=tz.utc))[0]
        self.assertEqual(result['timezone'], 'America/New_York')
        self.assertFalse(result['sessionEnded'])
        self.assertEqual(SessionAttendance.objects.count(), 0)
        self.user.refresh_from_db()
        self.assertEqual(self.user.timezone, 'America/New_York')


    def test_join_window_boundaries_and_late_first_join(self):
        from uuid import uuid4
        from datetime import datetime, timedelta, timezone as tz
        from apps.dashboard.models import SessionAttendance, SessionOccurrence
        session_id = str(uuid4())
        item = dict(id=session_id, title='Sorting', dayOfWeek='Monday', startTime='10:00', endTime='11:30', timezone='Asia/Karachi', status='upcoming')
        SavedTimetable.objects.create(user=self.user, schedule=[item])
        route = f'/api/dashboard/timetable/sessions/{session_id}/join/'
        start = datetime(2026, 10, 12, 5, tzinfo=tz.utc)
        for delta, expected in [(timedelta(minutes=-3, seconds=-1), 409), (timedelta(minutes=-3), 200), (timedelta(minutes=10), 200), (timedelta(minutes=10, microseconds=1), 409), (timedelta(minutes=90), 409)]:
            with self.subTest(delta=delta):
                SessionAttendance.objects.all().delete()
                SessionOccurrence.objects.all().delete()
                with patch('apps.dashboard.services.session_join_service.timezone.now', return_value=start + delta):
                    response = self.client.post(route)
                self.assertEqual(response.status_code, expected)
                self.assertEqual(SessionAttendance.objects.count(), 1 if expected == 200 else 0)
                self.assertEqual(SessionOccurrence.objects.count(), 1 if expected == 200 else 0)
                if delta == timedelta(minutes=10, microseconds=1):
                    self.assertIn('late', str(response.data))


    def test_early_join_at_midnight_crosses_week_boundary(self):
        from uuid import uuid4
        from datetime import datetime, timezone as tz
        from apps.dashboard.models import SessionAttendance
        session_id = str(uuid4())
        SavedTimetable.objects.create(user=self.user, schedule=[dict(id=session_id, title='Midnight lesson', dayOfWeek='Monday', startTime='00:00', endTime='01:00', timezone='UTC', status='upcoming')])
        with patch('apps.dashboard.services.session_join_service.timezone.now', return_value=datetime(2026, 10, 11, 23, 57, tzinfo=tz.utc)):
            response = self.client.post(f'/api/dashboard/timetable/sessions/{session_id}/join/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(SessionAttendance.objects.get().session_date.isoformat(), '2026-10-12')
