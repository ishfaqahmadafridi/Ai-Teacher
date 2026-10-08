"""Idempotent occurrence snapshots and missed attendance, without LLM calls."""
from datetime import datetime, timedelta, timezone as datetime_timezone
from django.db import transaction
from django.utils import timezone
from apps.dashboard.models import SavedTimetable, SessionAttendance, SessionOccurrence
from .session_attendance import session_window


def snapshot_occurrence(user, item, start, end):
    return SessionOccurrence.objects.get_or_create(
        user=user, session_id=item["id"], session_date=start.date(),
        defaults={"starts_at": start, "ends_at": end, "timezone": item.get("timezone") or user.timezone or "UTC",
                  "title": item.get("title", ""), "subject": item.get("subject", "")},
    )[0]


def reconcile_timetable(saved_id, now=None):
    now = now or timezone.now()
    with transaction.atomic():
        saved = SavedTimetable.objects.select_for_update(of=("self",)).select_related("user").get(pk=saved_id)
        next_ends = []
        for item in saved.schedule:
            active = datetime.fromisoformat(item["activeFrom"]) if item.get("activeFrom") else saved.updated_at
            if timezone.is_naive(active):
                active = timezone.make_aware(active, datetime_timezone.utc)
            # Backfill every elapsed week, including periods when the student never logged in.
            cursor = max(active, saved.reconciled_through) if saved.reconciled_through else active
            while cursor <= now:
                start, end = session_window(item, saved.user.timezone, cursor)
                if start >= active and end <= now:
                    snapshot_occurrence(saved.user, item, start, end)
                    SessionAttendance.objects.get_or_create(
                        user=saved.user, session_id=item["id"], session_date=start.date(),
                        defaults={"status": "missed"},
                    )
                cursor = start + timedelta(days=7)
            start, end = session_window(item, saved.user.timezone, max(active, now))
            while end <= now or start < active:
                start, end = session_window(item, saved.user.timezone, start + timedelta(days=7))
            next_ends.append(end)
        saved.next_reconciliation_at = min(next_ends) if next_ends else None
        saved.reconciled_through = now
        saved.save(update_fields=["reconciled_through", "next_reconciliation_at"])
