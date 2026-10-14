"""Short authenticated API requests; AI work runs in the lesson queue."""
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework.throttling import UserRateThrottle
from drf_spectacular.utils import extend_schema
from django.conf import settings
from apps.classroom.views.note_views import PrivateNotesView
from apps.classroom.serializers.lesson_job_serializers import LessonJobRequestSerializer, LessonJobSerializer, LessonQueueMetricsSerializer
from apps.classroom.utilities.serializer_data import validated_mapping
from apps.classroom.services.lesson_jobs import submit_lesson_job, get_lesson_job


class LessonSubmissionThrottle(UserRateThrottle):
    rate = settings.CLASSROOM_SUBMISSION_RATE


class LessonJobsView(PrivateNotesView):
    throttle_classes = [LessonSubmissionThrottle]

    @extend_schema(request=LessonJobRequestSerializer, responses={202: LessonJobSerializer}, tags=['classroom'])
    def post(self, request):
        serializer = LessonJobRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        inputs = validated_mapping(serializer.validated_data)
        request_id = inputs.pop('request_id')
        job = submit_lesson_job(request.user, request_id, inputs)
        return Response(LessonJobSerializer(job).data, status=202)


class LessonJobView(PrivateNotesView):
    @extend_schema(responses=LessonJobSerializer, tags=['classroom'])
    def get(self, request, job_id):
        return Response(LessonJobSerializer(get_lesson_job(request.user, job_id)).data)


class LessonQueueMetricsView(PrivateNotesView):
    permission_classes = [IsAdminUser]

    @extend_schema(responses=LessonQueueMetricsSerializer, tags=['classroom'])
    def get(self, request):
        from apps.classroom.services.lesson_job_metrics import lesson_queue_metrics
        return Response(LessonQueueMetricsSerializer(lesson_queue_metrics()).data)
