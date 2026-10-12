"""Create genuine Word documents from saved notes, with no inference calls."""
from io import BytesIO
from django.conf.locale import LANG_INFO
from docx import Document
from docx.shared import Inches
from docx.oxml import OxmlElement
from docx.enum.text import WD_ALIGN_PARAGRAPH


def add_note_paragraph(document, text, *, rtl=False, style=None):
    paragraph = document.add_paragraph(style=style)
    run = paragraph.add_run(text)
    if rtl:
        paragraph.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        bidi = OxmlElement('w:bidi')
        paragraph._p.get_or_add_pPr().append(bidi)
        run.font.rtl = True
        run.font.complex_script = True
        run.font.name = 'Arial'
    return paragraph


def create_note_document(content, figures=None):
    document = Document()
    rtl = LANG_INFO.get(content['language'], {}).get('bidi', False)
    document.core_properties.title = content['title']
    document.core_properties.language = content['language']
    if content.get('version'):
        document.core_properties.comments = f"Lesson version: {content['version']}"
    add_note_paragraph(document, content['title'], rtl=rtl, style='Title')
    for index, section in enumerate(content['sections']):
        if section['key_point']:
            add_note_paragraph(document, section['key_point'], rtl=rtl, style='Heading 1')
        add_note_paragraph(document, section['explanation'], rtl=rtl)
        if section['formula']:
            add_note_paragraph(document, section['formula'])
        if figures and index in figures:
            document.add_picture(BytesIO(figures[index]), width=Inches(6))
        if section.get('image_source'):
            add_note_paragraph(document, section['image_source'])
        if section['annotation']:
            add_note_paragraph(document, section['annotation'], rtl=rtl, style='Caption')
    for source in content.get('sources', []):
        add_note_paragraph(document, f"[{source['number']}] {source['title']} — {source['url']}")
    output = BytesIO()
    document.save(output)
    return output.getvalue()
