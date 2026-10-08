from datetime import datetime, timedelta
from django.utils import timezone
import hashlib
import json
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from django.conf import settings
from apps.dashboard.models import CourseModel, TimetableJob, SavedTimetable
from apps.dashboard.serializers.timetable_serializers import TimetablePreferencesSerializer, ManualSlotSerializer
from apps.dashboard.tasks import generate_timetable
from apps.dashboard.constants.timetable_prompts import PLANNER_VERSION

from apps.dashboard.services.session_attendance import schedule_with_attendance

class TimetableThrottle(UserRateThrottle):
    scope = "timetable"
    def get_rate(self):
        return settings.TIMETABLE_REQUEST_RATE

class TimetableGenerateView(APIView):
    throttle_classes = [TimetableThrottle]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = TimetablePreferencesSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        preferences = dict(serializer.data)
        with transaction.atomic():
            get_user_model().objects.select_for_update().get(pk=request.user.pk)
            courses = list(CourseModel.objects.filter(user=request.user).order_by("id").values("id", "title", "subject_field"))
            if not courses:
                return Response({"detail": "Register a course before creating a timetable."}, status=400)
            inputs = {"courses": courses, "preferences": preferences, "planner_version": PLANNER_VERSION}
            fingerprint = hashlib.sha256(json.dumps(inputs, sort_keys=True).encode()).hexdigest()
            TimetableJob.objects.filter(user=request.user, status__in=["queued", "processing"], updated_at__lt=timezone.now()-timedelta(seconds=settings.TIMETABLE_JOB_TIMEOUT_SECONDS)).update(status="failed", error="Planning timed out. Please retry.")
            pending = TimetableJob.objects.filter(user=request.user, status__in=["queued", "processing"]).first()
            if pending:
                return Response({"id": str(pending.id), "status": pending.status}, status=202)
            job, created = TimetableJob.objects.get_or_create(user=request.user, fingerprint=fingerprint, defaults={"inputs": inputs})
            if created or job.status == "failed":
                job.status, job.error = "queued", ""
                job.save()
                def enqueue():
                    try:
                        generate_timetable.delay(str(job.id))
                    except Exception:
                        TimetableJob.objects.filter(pk=job.id).update(status="failed", error="The planning queue is unavailable. Please retry.")
                transaction.on_commit(enqueue)
        return Response({"id": str(job.id), "status": job.status}, status=202)

class TimetableJobView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, job_id):
        job = get_object_or_404(TimetableJob, pk=job_id, user=request.user)
        return Response({"id": str(job.id), "status": job.status, "result": job.result, "error": job.error})
    def post(self, request, job_id):
        with transaction.atomic():
            get_user_model().objects.select_for_update().get(pk=request.user.pk)
            job = get_object_or_404(TimetableJob, pk=job_id, user=request.user, status="ready")
            if not set(str(course.pk) for course in CourseModel.objects.filter(user=request.user)).issuperset(item["courseId"] for item in job.result["schedule"]):
                return Response({"detail": "Courses changed. Generate a new timetable."}, status=409)
            saved, _ = SavedTimetable.objects.update_or_create(user=request.user, defaults={"schedule": [{**item, "activeFrom": timezone.now().isoformat()} for item in job.result["schedule"]]})
        return Response({"schedule": saved.schedule})

class SavedTimetableView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        saved = SavedTimetable.objects.filter(user=request.user).first()
        return Response({"schedule": schedule_with_attendance(saved, request.user) if saved else []})

    def post(self, request):
        serializer = ManualSlotSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        item = dict(serializer.data)
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
            return Response({"detail": "Choose a valid same-day time range."}, status=400)
        if not CourseModel.objects.filter(user=request.user, title=item["subject"]).exists():
            return Response({"detail": "Choose one of your registered courses."}, status=400)
        item["timeFormatted"] = item["timeSlot"]
        item["timezone"] = request.user.timezone or "UTC"
        item["activeFrom"] = timezone.now().isoformat()
        with transaction.atomic():
            get_user_model().objects.select_for_update().get(pk=request.user.pk)
            saved, _ = SavedTimetable.objects.get_or_create(user=request.user)
            for existing in saved.schedule:
                if existing["dayOfWeek"] == item["dayOfWeek"] and existing["startTime"] < item["endTime"] and item["startTime"] < existing["endTime"]:
                    return Response({"detail": "This time overlaps an existing session."}, status=400)
            saved.schedule = [*saved.schedule, item]
            saved.save()
        return Response({"schedule": saved.schedule}, status=201)
