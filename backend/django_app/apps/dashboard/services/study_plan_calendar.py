"""Build actual calendar slots for a finite study period."""
from calendar import day_name, monthrange
from datetime import date, datetime, time, timedelta
from zoneinfo import ZoneInfo
from django.utils import timezone
from ..constants.study_plan import STUDY_PLAN_MAX_SESSIONS


def study_plan_dates(preferences):
    start = date.fromisoformat(preferences['start_date'])
    month_index = start.year * 12 + start.month - 1 + preferences['duration_months']
    year, month = divmod(month_index, 12)
    end = date(year, month + 1, min(start.day, monthrange(year, month + 1)[1]))
    return start, end


def dated_slots(preferences):
    # Local wall-clock dates are retained; timezone conversion happens at admission.
    from .timetable_scheduler import minutes
    start_date, end_date = study_plan_dates(preferences)
    start, end = minutes(preferences['start_time']), minutes(preferences['end_time'])
    duration, gap = preferences['session_minutes'], preferences['break_minutes']
    now = timezone.now()
    zone = ZoneInfo(preferences['timezone'])
    slots = []
    day = start_date
    while day < end_date:
        if day_name[day.weekday()] in preferences['days']:
            for index in range(preferences['max_classes']):
                at = start + index * (duration + gap)
                scheduled = datetime.combine(day, time(at // 60, at % 60), zone)
                if at + duration <= end and scheduled >= now:
                    slots.append((day, at))
        day += timedelta(days=1)
    if not slots or len(slots) > STUDY_PLAN_MAX_SESSIONS:
        raise ValueError(f'Choose availability with 1–{STUDY_PLAN_MAX_SESSIONS} classes over the study period.')
    return slots
