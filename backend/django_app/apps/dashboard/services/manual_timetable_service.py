"""Persist owned manual slots independently from asynchronous planning requests."""
from datetime import datetime
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from ..models import CourseModel, SavedTimetable


def add_timetable_slot(user, item):
    try:
        start, end = item["timeSlot"].split(" - ")
        def parse(value):
            for pattern in ("%H:%M", "%I:%M %p"):
                try:
                    return datetime.strptime(value, pattern).strftime("%H:%M")
                except ValueError:
                    pass
            raise ValueError()
        item["startTime"], item["endTime"] = parse(start), parse(end)
        if item["startTime"] >= item["endTime"]:
            raise ValueError()
    except ValueError:
        raise ValidationError("Choose a valid same-day time range.")
    if not CourseModel.objects.filter(user=user, title=item["subject"]).exists():
        raise ValidationError("Choose one of your registered courses.")
    item["timeFormatted"] = item["timeSlot"]
    item["timezone"] = user.timezone or "UTC"
    item["activeFrom"] = timezone.now().isoformat()
    with transaction.atomic():
        get_user_model().objects.select_for_update().get(pk=user.pk)
        saved, _ = SavedTimetable.objects.get_or_create(user=user)
        if any(existing["id"] == item["id"] for existing in saved.schedule):
            raise ValidationError("This session identifier already exists. Create a new slot.")
        for existing in saved.schedule:
            if existing["dayOfWeek"] == item["dayOfWeek"] and existing["startTime"] < item["endTime"] and item["startTime"] < existing["endTime"]:
                raise ValidationError("This time overlaps an existing session.")
        saved.schedule = [*saved.schedule, item]
        saved.next_reconciliation_at = None
        saved.save()
    return {"schedule": saved.schedule}
