"""Create genuine Word documents from saved notes, with no inference calls."""
from io import BytesIO
from datetime import timezone
from django.conf.locale import LANG_INFO
from docx import Document
from docx.shared import Inches


from .note_markdown import add_note_paragraph, add_note_markdown
from ..constants.notes import NOTE_DOCUMENT_LABEL, NOTE_DATE_FORMAT, NOTE_FIGURE_WIDTH_INCHES


def create_note_document(content, figures=None):
    document = Document()
    rtl = LANG_INFO.get(content['language'], {}).get('bidi', False)
    document.core_properties.title = content['title']
    document.core_properties.language = content['language']
    if content.get('version'):
        document.core_properties.comments = f"Lesson version: {content['version']}"
    add_note_paragraph(document, content['title'], rtl=rtl, style='Title')
    add_note_paragraph(document, NOTE_DOCUMENT_LABEL, rtl=rtl, style='Subtitle')
    if content.get('created_at'):
        date = content['created_at'].astimezone(timezone.utc).strftime(NOTE_DATE_FORMAT)
        add_note_paragraph(document, f'Lecture date (UTC): {date}', rtl=rtl)
    add_note_paragraph(document, f"Language: {content['language']}", rtl=rtl)
    for index, section in enumerate(content['sections']):
        if section['key_point']:
            add_note_paragraph(document, section['key_point'], rtl=rtl, style='Heading 1')
        add_note_markdown(document, section['explanation'], rtl=rtl)
        if section['formula']:
            add_note_paragraph(document, section['formula'])
        if figures and index in figures:
            document.add_picture(BytesIO(figures[index]), width=Inches(NOTE_FIGURE_WIDTH_INCHES))
        if section.get('image_source'):
            add_note_paragraph(document, section['image_source'])
        if section['annotation']:
            add_note_paragraph(document, section['annotation'], rtl=rtl, style='Caption')
    for source in content.get('sources', []):
        add_note_paragraph(document, f"[{source['number']}] {source['title']} — {source['url']}")
    output = BytesIO()
    document.save(output)
    return output.getvalue()
