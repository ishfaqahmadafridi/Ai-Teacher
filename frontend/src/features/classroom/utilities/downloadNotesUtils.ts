/** Pure filename normalization shared by saved-note exports. */
import { NOTE_FILENAME_MAX_LENGTH } from '../constants/notesConstants';

export function lectureNoteFilename(title: string): string {
  return title.replace(/[<>:"/\\|?*\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim().replace(/[. ]+$/g, '').slice(0, NOTE_FILENAME_MAX_LENGTH) || 'Lecture notes';
}
