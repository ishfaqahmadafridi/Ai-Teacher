"""Reuse validated answers as durable notes without generating or summarizing again."""
from apps.classroom.utilities.serializer_data import validated_mapping
import hashlib
import json
import mimetypes
from urllib.parse import urlsplit
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from django.conf.locale import LANG_INFO
from django.utils.translation import get_supported_language_variant
from apps.classroom.constants.notes import NOTES_PAGE_SIZE, ACCOUNT_SESSION_PREFIX
from django.shortcuts import get_object_or_404
from apps.classroom.models.lecture_notes import LectureNote
from apps.classroom.serializers.ask_serializers import GeneratedAnswerSerializer
from apps.classroom.serializers.note_serializers import NoteSourceSerializer


def save_lecture_note(user, session_id, answer):
    serializer = GeneratedAnswerSerializer(data=answer)
    serializer.is_valid(raise_exception=True)
    snapshot = validated_mapping(serializer.validated_data)
    raw_language = snapshot['language'].strip()
    try:
        snapshot['language'] = get_supported_language_variant(raw_language.lower().replace('_', '-'))
    except LookupError:
        snapshot['language'] = next((code for code, info in LANG_INFO.items()
                                     if info.get('name', '').casefold() == raw_language.casefold()), raw_language)
    sources = NoteSourceSerializer(data=answer.get('model_info', {}).get('sources', []), many=True)
    snapshot['sources'] = list(sources.data) if sources.is_valid() else []
    version = hashlib.sha256(json.dumps(snapshot, sort_keys=True, ensure_ascii=False).encode()).hexdigest()
    note, _ = LectureNote.objects.get_or_create(user=user, session_id=session_id, version=version,
                                              defaults={'answer': snapshot})
    return note


def get_lecture_note(user, note_id):
    return get_object_or_404(LectureNote, user=user, pk=note_id)


def note_content(note):
    answer = note.answer
    return {'sources': answer.get('sources', []), 'title': answer['topic'], 'language': answer['language'], 'sections': [
        {'key_point': chunk.get('key_point', ''), 'explanation': chunk['speak'],
         'formula': chunk.get('diagram', {}).get('formula') or '',
         'annotation': chunk.get('diagram', {}).get('annotation') or '',
         'image_source': diagram_image_source(answer['diagram_type'], chunk.get('diagram', {}).get('target'))}
        for chunk in answer['chunks']
    ]}


def note_response(note, content=None, tokens=0):
    from apps.classroom.services.visual_assets import stored_note_asset_paths
    content = content or note_content(note)
    return {**content, 'id': note.id, 'version': note.version, 'created_at': note.created_at,
            'figure_indices': sorted(set(stored_note_asset_paths(note)) | {figure.section_index for figure in note.figures.all() if figure.image}),
            'source_language': note.answer['language'], 'extra_llm_tokens': tokens,
            'direction': 'rtl' if LANG_INFO.get(content['language'], {}).get('bidi', False) else 'ltr'}


def list_lecture_notes(user, session_id=None):
    notes = LectureNote.objects.filter(user=user)
    if session_id is not None:
        notes = notes.filter(session_id=session_id)
    return [note_response(note) for note in notes.prefetch_related('figures').order_by('-created_at')[:NOTES_PAGE_SIZE]]


def account_session_id(user, session_id):
    """Scope conversation history to its authenticated account before inference."""
    if not user.is_authenticated:
        return session_id
    return ACCOUNT_SESSION_PREFIX + hashlib.sha256(f'{user.pk}:{session_id}'.encode()).hexdigest()


def diagram_image_source(diagram_type, target):
    if isinstance(target, str) and target.startswith('/api/visual-assets/'):
        return target
    if not isinstance(target, str):
        return ''
    try:
        URLValidator(schemes=['http', 'https'])(target)
        content_type = mimetypes.guess_type(urlsplit(target).path)[0] or ''
        return target if diagram_type == 'image' or content_type.startswith('image/') else ''
    except ValidationError:
        return ''
