"""Resolve weekly session occurrences using saved timezone and dated attendance."""
from calendar import day_name
from datetime import datetime, time, timedelta
from uuid import UUID
from zoneinfo import ZoneInfo
from django.utils import timezone
from apps.dashboard.models import SessionAttendance
from apps.users.services.timezone_service import country_default_timezone


def session_window(item, profile_timezone, now=None):
    now = now or timezone.now()
    zone = ZoneInfo(item.get("timezone") or profile_timezone or "UTC")
    today = now.astimezone(zone).date()
    monday = today - timedelta(days=today.weekday())
    date = monday + timedelta(days=list(day_name).index(item["dayOfWeek"]))
    return (datetime.combine(date, time.fromisoformat(item["startTime"]), zone),
            datetime.combine(date, time.fromisoformat(item["endTime"]), zone))


def schedule_with_attendance(saved, user, now=None):
    now = now or timezone.now()
    # Repair legacy defaults for countries with one unambiguous IANA timezone.
    country_zone = country_default_timezone(user.country)
    if country_zone and user.timezone != country_zone:
        user.timezone = country_zone
        user.save(update_fields=["timezone"])
    if country_zone and any(item.get("timezone") != country_zone for item in saved.schedule):
        saved.schedule = [{**item, "timezone": country_zone, "activeFrom": item.get("activeFrom", saved.updated_at.isoformat())} for item in saved.schedule]
        saved.save(update_fields=["schedule"])
    windows = [session_window(item, user.timezone, now) for item in saved.schedule]
    dates = {start.date() for start, _ in windows}
    attendance = {(record.session_id, record.session_date): record.status
                  for record in SessionAttendance.objects.filter(user=user, session_date__in=dates)}
    result = []
    for original, (start, end) in zip(saved.schedule, windows):
        item = dict(original)
        item["sessionDate"] = start.date().isoformat()
        key = (UUID(item["id"]), start.date())
        active_from = datetime.fromisoformat(item["activeFrom"]) if item.get("activeFrom") else saved.updated_at
        item["sessionEnded"] = now >= end
        if item["sessionEnded"] and start >= active_from and key not in attendance:
            record, _ = SessionAttendance.objects.get_or_create(
                user=user, session_id=key[0], session_date=key[1],
                defaults={"status": "missed"},
            )
            attendance[key] = record.status
        item["attendance"] = attendance.get(key, "unmarked")
        result.append(item)
    return result
