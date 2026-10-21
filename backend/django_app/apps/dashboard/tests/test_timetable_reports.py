"""Focused regression coverage; shared setup lives in the fixture module."""
from unittest.mock import patch
from django.contrib.auth import get_user_model
from django.test import TestCase
from apps.dashboard.models import SavedTimetable
from .timetable_fixtures import TimetableFixture


class TimetableReportTests(TimetableFixture, TestCase):
    def test_background_backfill_and_report_survive_replacement(self):
        from uuid import uuid4
        from datetime import datetime, timezone as tz
        from apps.dashboard.models import SessionAttendance, SessionOccurrence
        from apps.dashboard.services.attendance_reconciliation import reconcile_timetable
        item = dict(id=str(uuid4()), title='Sorting', subject='Algorithms', dayOfWeek='Monday', startTime='09:00', endTime='10:00', timezone='Asia/Karachi', activeFrom='2026-10-01T00:00:00+00:00')
        saved = SavedTimetable.objects.create(user=self.user, schedule=[item])
        now = datetime(2026, 10, 20, tzinfo=tz.utc)
        reconcile_timetable(saved.pk, now)
        reconcile_timetable(saved.pk, now)
        self.assertEqual(SessionAttendance.objects.count(), 3)
        self.assertEqual(SessionOccurrence.objects.count(), 3)
        saved.schedule = []
        saved.save()
        with patch('apps.dashboard.services.attendance_report_service.timezone.now', return_value=now):
            response = self.client.get('/api/dashboard/attendance/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['attendanceLogs']), 3)
        self.assertEqual(response.data['attendanceLogs'][0]['status'], 'absent')
        other = get_user_model().objects.create_user(username='report-other')
        self.client.force_authenticate(other)
        self.assertEqual(self.client.get('/api/dashboard/attendance/').data['attendanceLogs'], [])


    def test_report_export_escapes_formulas_and_counts_completed_classes(self):
        from uuid import uuid4
        from datetime import datetime, timedelta, timezone as tz
        from apps.dashboard.models import SessionAttendance, SessionOccurrence
        now = datetime.now(tz.utc)
        session_id = uuid4()
        SessionOccurrence.objects.create(user=self.user, session_id=session_id, session_date=now.date(), starts_at=now-timedelta(hours=2), ends_at=now-timedelta(hours=1), timezone='UTC', title='=1+1', subject='Algorithms')
        SessionAttendance.objects.create(user=self.user, session_id=session_id, session_date=now.date(), status='attended', joined_at=now-timedelta(hours=2))
        report = self.client.get('/api/dashboard/attendance/').data
        self.assertEqual(report['summary'], dict(total=1, attended=1, missed=0, rate=100))
        export = self.client.get('/api/dashboard/attendance/export/')
        csv = b''.join(export.streaming_content).decode()
        self.assertIn("'=1+1", csv)


    def test_empty_report_has_no_invented_percentage(self):
        self.assertEqual(self.client.get('/api/dashboard/attendance/').data['summary']['rate'], None)


    def test_background_worker_skips_timetables_until_the_next_class_ends(self):
        from datetime import timedelta
        from django.utils import timezone
        from apps.dashboard.tasks import reconcile_attendance
        SavedTimetable.objects.create(user=self.user, schedule=[{'id': 'unused'}], next_reconciliation_at=timezone.now() + timedelta(hours=1))
        with patch('apps.dashboard.services.attendance_reconciliation.reconcile_timetable') as reconcile:
            reconcile_attendance()
        reconcile.assert_not_called()


    def test_summary_and_recent_missed_are_not_limited_by_history_page(self):
        from uuid import uuid4
        from datetime import timedelta
        from django.utils import timezone
        from django.test import override_settings
        from apps.dashboard.models import SessionAttendance, SessionOccurrence
        now = timezone.now()
        occurrences, records = [], []
        for index in range(5):
            start = now - timedelta(days=index+1)
            session_id = uuid4()
            occurrences.append(SessionOccurrence(user=self.user, session_id=session_id, session_date=start.date(), starts_at=start, ends_at=start+timedelta(hours=1), timezone='UTC', title='Saved lesson', subject='Algorithms'))
            records.append(SessionAttendance(user=self.user, session_id=session_id, session_date=start.date(), status='attended' if index<2 else 'missed'))
        SessionOccurrence.objects.bulk_create(occurrences)
        SessionAttendance.objects.bulk_create(records)
        with override_settings(ATTENDANCE_HISTORY_PAGE_SIZE=2):
            report = self.client.get('/api/dashboard/attendance/').data
        self.assertEqual(len(report['attendanceLogs']), 2)
        self.assertEqual(len(report['recentMissed']), 3)
        self.assertEqual(report['summary'], dict(total=5, attended=2, missed=3, rate=40))
