"""Pure saved-note filename normalization."""
import re
from ..constants.notes import NOTE_FILENAME_MAX_LENGTH


def note_document_filename(title):
    """Keep the topic readable while excluding unsafe filename characters."""
    name = re.sub(r'[<>:"/\\|?*\x00-\x1f]', ' ', title)
    name = re.sub(r'\s+', ' ', name).strip().rstrip('. ')[:NOTE_FILENAME_MAX_LENGTH] or 'Lecture notes'
    return f'{name}.docx'


