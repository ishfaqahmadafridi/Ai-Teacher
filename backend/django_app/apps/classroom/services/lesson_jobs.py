"""Durable admission, account-scoped single flight and bounded worker claims."""
import hashlib
import json
import logging
from datetime import timedelta
from uuid import uuid4
from django.conf import settings
from django.db import transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.exceptions import APIException, ValidationError
from apps.classroom.models.lesson_job import LessonJob, LessonQueueGate, LessonJobSubmission
from apps.classroom.services.lecture_notes import account_session_id, save_lecture_note
from apps.classroom.services.session_service import get_session, append_session
from apps.classroom.inference.pipeline import generate_answer

logger = logging.getLogger(__name__)


class LessonQueueFull(APIException):
    status_code = 429
    default_detail = 'Lesson preparation is busy. Please try again shortly.'


def submit_lesson_job(user, request_id, inputs):
    with transaction.Atomic(using=None, savepoint=True, durable=False):
        LessonQueueGate.objects.get_or_create(pk=1)
        LessonQueueGate.objects.select_for_update().get(pk=1)
        submission = LessonJobSubmission.objects.select_related('job').filter(user=user, request_id=request_id).first()
        existing = submission.job if submission else LessonJob.objects.filter(user=user, request_id=request_id).first()
        if existing:
            if existing.inputs != inputs:
                raise ValidationError('This request ID belongs to a different question.')
            return existing
        private_session = account_session_id(user, inputs['session_id'])
        fingerprint = hashlib.sha256(json.dumps({'inputs': inputs, 'history': get_session(private_session)}, sort_keys=True).encode()).hexdigest()
        existing = LessonJob.objects.filter(user=user, flight_key=fingerprint, status__in=['queued', 'processing']).first()
        if existing:
            LessonJobSubmission.objects.create(user=user, request_id=request_id, job=existing)
            return existing
        if LessonJob.objects.filter(status__in=['queued', 'processing']).count() >= settings.CLASSROOM_MAX_PENDING_JOBS:
            raise LessonQueueFull()
        if LessonJob.objects.filter(user=user, status__in=['queued', 'processing']).count() >= settings.CLASSROOM_USER_PENDING_JOBS:
            raise LessonQueueFull()
        job = LessonJob.objects.create(user=user, request_id=request_id, flight_key=fingerprint, inputs=inputs)
        LessonJobSubmission.objects.create(user=user, request_id=request_id, job=job)
        transaction.on_commit(lambda: publish_lesson_job(str(job.pk)))
        return job


def publish_lesson_job(job_id):
    from config.celery import app
    try:
        app.send_task('apps.classroom.tasks.prepare_lesson', args=[job_id])
    except Exception:
        # The database is the outbox; periodic recovery retries publication.
        logger.warning('Lesson job publication unavailable; pending job will be recovered')


def get_lesson_job(user, job_id):
    return get_object_or_404(LessonJob, user=user, pk=job_id)


def run_lesson_job(job_id):
    token = uuid4()
    with transaction.Atomic(using=None, savepoint=True, durable=False):
        gate = LessonQueueGate.objects.select_for_update().get(pk=1)
        job = LessonJob.objects.select_for_update().select_related('user').get(pk=job_id)
        if job.status != 'queued' or (job.next_attempt_at and job.next_attempt_at > timezone.now()):
            return
        if gate.breaker_until and gate.breaker_until > timezone.now():
            job.next_attempt_at = gate.breaker_until
            job.save(update_fields=['next_attempt_at', 'updated_at'])
            return
        if LessonJob.objects.filter(status='processing').count() >= settings.CLASSROOM_MAX_RUNNING_JOBS:
            return
        # Preserve conversation order: only one generating turn per private session.
        if LessonJob.objects.filter(user=job.user, inputs__session_id=job.inputs['session_id']).filter(
            Q(status='processing') | Q(status='queued', created_at__lt=job.created_at)
        ).exists():
            return
        from apps.classroom.services.lesson_provider_admission import provider_delay
        try:
            delay = provider_delay()
        except Exception:
            job.next_attempt_at = timezone.now() + timedelta(seconds=settings.CLASSROOM_BREAKER_SECONDS)
            job.save(update_fields=['next_attempt_at', 'updated_at'])
            logger.warning('Shared provider admission unavailable; lesson deferred')
            return
        if delay:
            job.next_attempt_at = timezone.now() + timedelta(seconds=delay)
            job.save(update_fields=['next_attempt_at', 'updated_at'])
            return
        job.status, job.run_token = 'processing', token
        job.attempts += 1
        job.save(update_fields=['status', 'run_token', 'attempts', 'updated_at'])
    current = LessonJob.objects.filter(pk=job_id, status='processing', run_token=token)
    started = timezone.now()
    try:
        result = generate_answer(**{**job.inputs, 'session_id': account_session_id(job.user, job.inputs['session_id']), 'persist_history': False})
        if result.get('topic') == 'unknown':
            raise ValueError('Lesson provider unavailable')
        with transaction.Atomic(using=None, savepoint=True, durable=False):
            gate = LessonQueueGate.objects.select_for_update().get(pk=1)
            locked = current.select_for_update().first()
            if not locked:
                return
            gate.failures, gate.breaker_until = 0, None
            gate.save(update_fields=['failures', 'breaker_until'])
            note = save_lecture_note(job.user, job.inputs['session_id'], result)
            append_session(account_session_id(job.user, job.inputs['session_id']), [
                {'role': 'user', 'content': job.inputs['question']},
                {'role': 'assistant', 'content': json.dumps(note.answer)},
            ])
            result.setdefault('model_info', {})['note_id'] = str(note.pk)
            logger.info('Lesson job=%s tokens_used=%s', job_id, result.get('tokens_used', 0))
            current.update(status='ready', result=result, error='', updated_at=timezone.now())
    except Exception:
        with transaction.Atomic(using=None, savepoint=True, durable=False):
            gate = LessonQueueGate.objects.select_for_update().get(pk=1)
            gate.failures += 1
            if gate.failures >= settings.CLASSROOM_BREAKER_FAILURES:
                gate.breaker_until = timezone.now() + timedelta(seconds=settings.CLASSROOM_BREAKER_SECONDS)
            gate.save(update_fields=['failures', 'breaker_until'])
        retry = job.attempts < settings.CLASSROOM_JOB_MAX_ATTEMPTS
        current.update(status='queued' if retry else 'failed',
                       next_attempt_at=timezone.now() + timedelta(seconds=settings.CLASSROOM_RETRY_SECONDS * 2 ** (job.attempts - 1)) if retry else None,
                       error='Lesson provider is unavailable; retrying shortly.' if retry else 'Lesson preparation failed. Please try again.',
                       updated_at=timezone.now())
        logger.warning('Lesson preparation failed for job %s', job_id)
    finally:
        logger.info('Lesson job=%s elapsed_seconds=%.2f queue_wait_seconds=%.2f', job_id, (timezone.now() - started).total_seconds(), (started - job.created_at).total_seconds())
