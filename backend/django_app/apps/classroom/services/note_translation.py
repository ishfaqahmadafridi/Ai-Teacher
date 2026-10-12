"""Explicit bounded translation with durable reuse and concurrent request admission."""
from datetime import timedelta
import json
import re
from collections import Counter
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import APIException, ValidationError
from apps.classroom.models.lecture_notes import NoteTranslation
from apps.classroom.serializers.note_serializers import NoteContentSerializer
from apps.classroom.services.lecture_notes import note_content
from apps.classroom.services.llm_service import get_llm, extract_json
from apps.classroom.prompts.note_translation import NOTE_TRANSLATION_PROMPT
from apps.classroom.constants.notes import TRANSLATION_MAX_CHARACTERS, TRANSLATION_MAX_TOKENS, TRANSLATION_LEASE_SECONDS, TRANSLATION_MODEL


class TranslationUnavailable(APIException):
    status_code = 503
    default_detail = 'Translation is unavailable. Your original notes are still saved.'


class TranslationProcessing(APIException):
    status_code = 409
    default_detail = 'This translation is already processing. Please retry shortly.'


def translate_note(note, language):
    source = note_content(note)
    if language == source['language']:
        return source, 0
    serialized = json.dumps({key: value for key, value in source.items() if key != 'sources'}, ensure_ascii=False)
    if len(serialized) > TRANSLATION_MAX_CHARACTERS:
        raise ValidationError('These notes exceed the translation size limit. Download the original language.')
    with transaction.atomic():
        item, created = NoteTranslation.objects.get_or_create(note=note, language=language)
        item = NoteTranslation.objects.select_for_update().get(pk=item.pk)
        if item.status == 'ready':
            return item.content, 0
        if not created and item.status == 'processing' and item.updated_at > timezone.now() - timedelta(seconds=TRANSLATION_LEASE_SECONDS):
            raise TranslationProcessing()
        lease = timezone.now()
        item.status = 'processing'
        item.updated_at = lease
        item.save(update_fields=['status', 'updated_at'])
        lease = item.updated_at
    try:
        from langchain_core.messages import SystemMessage, HumanMessage
        llm = get_llm(temperature=0.1, model=TRANSLATION_MODEL, max_retries=0)
        if llm is None:
            raise TranslationUnavailable()
        result = llm.bind(max_output_tokens=TRANSLATION_MAX_TOKENS).invoke([
            SystemMessage(content=NOTE_TRANSLATION_PROMPT.format(language=language)),
            HumanMessage(content=serialized),
        ])
        serializer = NoteContentSerializer(data=extract_json(result.text))
        serializer.is_valid(raise_exception=True)
        translated = dict(serializer.validated_data)
        if translated['language'] != language or len(translated['sections']) != len(source['sections']):
            raise TranslationUnavailable()
        translated['sources'] = source['sources']
        for original, section in zip(source['sections'], translated['sections']):
            if Counter(re.findall(r'\d+(?:\.\d+)?', section['explanation'])) != Counter(re.findall(r'\d+(?:\.\d+)?', original['explanation'])):
                raise TranslationUnavailable()
            section['formula'] = original['formula']
            section['image_source'] = original.get('image_source', '')
        updated = NoteTranslation.objects.filter(pk=item.pk, status='processing', updated_at=lease).update(
            content=translated, status='ready', updated_at=timezone.now())
        if not updated:
            raise TranslationProcessing()
        return translated, (result.usage_metadata or {}).get('total_tokens', 0)
    except TranslationProcessing:
        raise
    except Exception:
        NoteTranslation.objects.filter(pk=item.pk, updated_at=lease).update(status='failed', updated_at=timezone.now())
        raise TranslationUnavailable() from None


def saved_note_content(note, language=None):
    if not language or language == note.answer['language']:
        return note_content(note)
    item = NoteTranslation.objects.filter(note=note, language=language, status='ready').first()
    if item is None:
        raise ValidationError('Translate this language first. Downloads never generate translations.')
    return item.content
