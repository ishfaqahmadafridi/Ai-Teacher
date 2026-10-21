"""Read attendance using the explicit saved timezone; never mutate during GET."""
from calendar import day_name
from datetime import date, datetime, time, timedelta
from uuid import UUID
from zoneinfo import ZoneInfo
from django.utils import timezone
from apps.dashboard.models import SessionAttendance
from ..constants.session_access_constants import JOIN_EARLY_MINUTES


def session_window(item, profile_timezone, now=None):
    now = now or timezone.now()
    zone = ZoneInfo(item.get("timezone") or profile_timezone or "UTC")
    if item.get('planStartDate') and item.get('sessionDate'):
        scheduled = date.fromisoformat(item['sessionDate'])
        return (datetime.combine(scheduled, time.fromisoformat(item['startTime']), zone),
                datetime.combine(scheduled, time.fromisoformat(item['endTime']), zone))
    today = now.astimezone(zone).date()
    monday = today - timedelta(days=today.weekday())
    occurrence_date = monday + timedelta(days=list(day_name).index(item["dayOfWeek"]))
    start = datetime.combine(occurrence_date, time.fromisoformat(item["startTime"]), zone)
    end = datetime.combine(occurrence_date, time.fromisoformat(item["endTime"]), zone)
    # Sunday night admission for a Monday midnight session belongs to the next week.
    if now >= end and start + timedelta(days=7, minutes=-JOIN_EARLY_MINUTES) <= now:
        start += timedelta(days=7)
        end += timedelta(days=7)
    return start, end


def schedule_with_attendance(saved, user, now=None):
    now = now or timezone.now()
    windows = [session_window(item, user.timezone, now) for item in saved.schedule]
    attendance = {(record.session_id, record.session_date): record.status
                  for record in SessionAttendance.objects.filter(user=user, session_date__in={start.date() for start, _ in windows})}
    return [{**item, "sessionDate": start.date().isoformat(), "sessionEnded": now >= end,
             "attendance": attendance.get((UUID(item["id"]), start.date()), "unmarked")}
            for item, (start, end) in zip(saved.schedule, windows)]
