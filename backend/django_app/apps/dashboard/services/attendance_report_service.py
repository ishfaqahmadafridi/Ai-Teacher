"""Attendance read models and CSV streaming, isolated from HTTP routing."""
import csv
from django.conf import settings
from django.db.models import Count, OuterRef, Q, Subquery
from django.utils import timezone
from ..models import SessionAttendance, SessionOccurrence
from ..serializers.attendance_serializers import AttendanceLogSerializer

def attendance_rows(user):
    records = SessionAttendance.objects.filter(user=user, session_id=OuterRef("session_id"), session_date=OuterRef("session_date"))
    return SessionOccurrence.objects.filter(user=user, ends_at__lte=timezone.now()).annotate(
        attendance_status=Subquery(records.values("status")[:1]),
    ).filter(attendance_status__isnull=False).order_by("-starts_at")


def attendance_log(row):
    return AttendanceLogSerializer({"id": str(row.pk), "dateFormatted": row.session_date.isoformat(), "className": row.title,
                                    "subject": row.subject, "status": "present" if row.attendance_status == "attended" else "absent"}).data


def attendance_report(user):
    rows = attendance_rows(user)
    totals = rows.aggregate(total=Count("pk"), attended=Count("pk", filter=Q(attendance_status="attended")), missed=Count("pk", filter=Q(attendance_status="missed")))
    totals["rate"] = round(totals["attended"] / totals["total"] * 100) if totals["total"] else None
    return {"attendanceLogs": [attendance_log(row) for row in rows[:settings.ATTENDANCE_HISTORY_PAGE_SIZE]],
             "recentMissed": [attendance_log(row) for row in rows.filter(attendance_status="missed")[:3]],
             "summary": totals}

class CsvBuffer:
    def write(self, value):
        return value


def csv_cell(value):
    # Prevent course titles from being interpreted as spreadsheet formulas.
    value = str(value)
    return "'" + value if value.lstrip().startswith(("=", "+", "-", "@")) else value


def attendance_csv(user):
    writer = csv.writer(CsvBuffer())
    yield writer.writerow(["Date", "Class", "Subject", "Status"])
    for row in attendance_rows(user).iterator(chunk_size=settings.ATTENDANCE_HISTORY_PAGE_SIZE):
        yield writer.writerow([row.session_date.isoformat(), csv_cell(row.title), csv_cell(row.subject), row.attendance_status])
