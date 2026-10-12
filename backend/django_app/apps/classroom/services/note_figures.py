"""Validate and store bounded classroom PNG snapshots; never download external URLs."""
import base64
import uuid
from io import BytesIO
from django.core.files.base import ContentFile
from django.db import transaction
from apps.classroom.models.lecture_notes import LectureNote
from PIL import Image, UnidentifiedImageError
from rest_framework.exceptions import ValidationError
from apps.classroom.models.lecture_notes import NoteFigure
from apps.classroom.constants.notes import FIGURE_MAX_BYTES, FIGURE_MAX_DIMENSION


def save_note_figure(note, section_index, image):
    if section_index >= len(note.answer['chunks']):
        raise ValidationError('Unknown lecture section.')
    try:
        raw = base64.b64decode(image, validate=True)
        if len(raw) > FIGURE_MAX_BYTES:
            raise ValueError('Image size limit')
        with Image.open(BytesIO(raw)) as figure:
            if figure.format != 'PNG' or max(figure.size) > FIGURE_MAX_DIMENSION:
                raise ValueError('Invalid image format or dimensions')
            figure.load()
            output = BytesIO()
            figure.convert('RGB').save(output, format='PNG')
            encoded = output.getvalue()
            if len(encoded) > FIGURE_MAX_BYTES:
                raise ValueError('Image size limit')
    except (ValueError, UnidentifiedImageError, OSError, Image.DecompressionBombError):
        raise ValidationError('Provide a valid PNG within the image size limits.') from None
    with transaction.atomic():
        LectureNote.objects.select_for_update().get(pk=note.pk)
        figure, _ = NoteFigure.objects.get_or_create(note=note, section_index=section_index)
        if not figure.image:
            try:
                figure.image.save(f'{uuid.uuid4()}.png', ContentFile(encoded))
            except Exception:
                if figure.image:
                    figure.image.delete(save=False)
                raise


def note_figures(note):
    images = {}
    for figure in note.figures.all():
        if figure.image:
            with figure.image.open('rb') as image:
                images[figure.section_index] = image.read(FIGURE_MAX_BYTES + 1)
    return images


def remove_figure_file(sender, instance, **kwargs):
    """Delete private files only after the owning database deletion commits."""
    if instance.image:
        storage, name = instance.image.storage, instance.image.name
        transaction.on_commit(lambda: storage.delete(name))


def read_note_figure(note, section_index):
    from django.shortcuts import get_object_or_404
    figure = get_object_or_404(NoteFigure, note=note, section_index=section_index)
    with figure.image.open('rb') as image:
        return image.read(FIGURE_MAX_BYTES + 1)
