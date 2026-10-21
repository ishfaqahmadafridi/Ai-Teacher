"""Account-owned persistence and editable AI drafts for registered courses."""
import json
import logging
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.exceptions import APIException, ValidationError
from apps.classroom.services.llm_service import get_llm
from ..models import CourseModel, SavedTimetable
from .session_attendance import schedule_with_attendance
from ..serializers.course_outline_serializers import CourseOutlineSerializer
from ..serializers.course_outline_draft import OutlineDraft
from ..constants.course_outline_prompts import COURSE_OUTLINE_PROMPT
from ..constants.outline_level_policies import OUTLINE_LEVEL_POLICIES

logger = logging.getLogger(__name__)


class OutlineUnavailable(APIException):
    status_code = 503
    default_detail = 'AI outline generation is unavailable. Please retry or enter your own topics.'


def owned_course(user, course_id):
    return get_object_or_404(CourseModel, pk=course_id, user=user)


def read_course_outline(user, course_id):
    course = owned_course(user, course_id)
    saved = SavedTimetable.objects.filter(user=user).first()
    sessions = []
    if saved:
        sessions = [dict(title=item['title'], day=item['dayOfWeek'], date=item['sessionDate'],
                         start=item['startTime'], end=item['endTime'], timezone=item.get('timezone') or user.timezone)
                    for item in schedule_with_attendance(saved, user)
                    if str(item.get('courseId')) == str(course.id)]
    return dict(topics=course.outline_topics, details=course.outline_details, sessions=sessions,
                source=course.outline_source, updated_at=course.outline_updated_at)


@transaction.atomic
def save_course_outline(user, course_id, data):
    get_user_model().objects.select_for_update().get(pk=user.pk)
    course = owned_course(user, course_id)
    course.outline_topics, course.outline_source = data['topics'], data['source']
    course.outline_details = data.get('details', [])
    course.outline_updated_at = timezone.now()
    course.save(update_fields=['outline_topics', 'outline_details', 'outline_source', 'outline_updated_at'])
    return read_course_outline(user, course_id)


def generate_course_outline(user, course_id):
    course = owned_course(user, course_id)
    level = (user.education_level or '').strip().lower().replace(' ', '_').replace('-', '_')
    if level not in OUTLINE_LEVEL_POLICIES:
        raise ValidationError({'detail': 'Set your education level in profile settings before generating an AI outline.'})
    level_label, guidance = OUTLINE_LEVEL_POLICIES[level]
    try:
        llm = get_llm(model=settings.TIMETABLE_MODEL, max_retries=0)
        if llm is None:
            raise OutlineUnavailable('AI generation is not configured or could not initialise. Your saved outline is unchanged; you can enter topics manually.')
        response = llm.with_structured_output(OutlineDraft).invoke([
            ('system', COURSE_OUTLINE_PROMPT + '\nTeaching-level requirements: ' + guidance),
            ('human', json.dumps(dict(title=course.title, field=course.subject_field,
                level=level, level_label=level_label, academic_year=user.academic_year,
                grade=user.grade_level, language=user.preferred_language))),
        ])
        draft = OutlineDraft.model_validate(response)
        serializer = CourseOutlineSerializer(data={'topics': draft.topics, 'details': [item.model_dump() for item in draft.details], 'source': 'ai'})
        serializer.is_valid(raise_exception=True)
        return {**serializer.validated_data, 'sessions': [], 'updated_at': None}
    except OutlineUnavailable:
        raise
    except Exception as error:
        logger.warning('Course outline generation failed for course %s (%s)', course_id, type(error).__name__)
        raise OutlineUnavailable() from error
