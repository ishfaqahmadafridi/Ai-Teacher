"""Account-owned persistence and editable AI drafts for registered courses."""
import json
import logging
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from pydantic import BaseModel, Field
from rest_framework.exceptions import APIException
from apps.classroom.services.llm_service import get_llm
from ..models import CourseModel
from ..serializers.course_outline_serializers import CourseOutlineSerializer
from ..constants.course_outline_prompts import COURSE_OUTLINE_PROMPT

logger = logging.getLogger(__name__)


class OutlineUnavailable(APIException):
    status_code = 503
    default_detail = 'AI outline generation is unavailable. Please retry or enter your own topics.'


class OutlineDraft(BaseModel):
    topics: list[str] = Field(min_length=1, max_length=60)


def owned_course(user, course_id):
    return get_object_or_404(CourseModel, pk=course_id, user=user)


def read_course_outline(user, course_id):
    course = owned_course(user, course_id)
    return dict(topics=course.outline_topics, source=course.outline_source, updated_at=course.outline_updated_at)


@transaction.atomic
def save_course_outline(user, course_id, data):
    get_user_model().objects.select_for_update().get(pk=user.pk)
    course = owned_course(user, course_id)
    course.outline_topics, course.outline_source = data['topics'], data['source']
    course.outline_updated_at = timezone.now()
    course.save(update_fields=['outline_topics', 'outline_source', 'outline_updated_at'])
    return read_course_outline(user, course_id)


def generate_course_outline(user, course_id):
    course = owned_course(user, course_id)
    try:
        llm = get_llm(model=settings.TIMETABLE_MODEL, max_retries=0)
        if llm is None:
            raise ValueError('Provider unavailable')
        response = llm.with_structured_output(OutlineDraft).invoke([
            ('system', COURSE_OUTLINE_PROMPT),
            ('human', json.dumps(dict(title=course.title, field=course.subject_field,
                level=user.education_level, academic_year=user.academic_year, language=user.preferred_language))),
        ])
        draft = OutlineDraft.model_validate(response)
        serializer = CourseOutlineSerializer(data={'topics': draft.topics, 'source': 'ai'})
        serializer.is_valid(raise_exception=True)
        return {**serializer.validated_data, 'updated_at': None}
    except Exception as error:
        logger.warning('Course outline generation failed for course %s', course_id)
        raise OutlineUnavailable() from error
