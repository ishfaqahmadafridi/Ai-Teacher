"""
apps/classroom/utilities/spoken_text.py

Remove Markdown emphasis from text that will be read aloud.

WHY:
    Models sometimes write *word* or **word** despite "no markdown" instructions, and speech
    synthesis may read the symbols aloud. Only paired emphasis, inline code marks and heading
    marks are removed; a lone '*' used as multiplication ("4 * a * c") is kept.
"""
import re

PAIRED_EMPHASIS = re.compile(r'(\*\*|__|\*|_)(?=\S)(.+?)(?<=\S)\1')
INLINE_CODE = re.compile(r'`([^`]+)`')
HEADING_MARK = re.compile(r'^\s{0,3}#{1,6}\s+', re.MULTILINE)


def speakable(text):
    """Text with Markdown emphasis, code and heading marks removed; content unchanged."""
    text = INLINE_CODE.sub(r'\1', text)
    text = HEADING_MARK.sub('', text)
    previous = None
    while previous != text:
        previous, text = text, PAIRED_EMPHASIS.sub(r'\2', text)
    return text
