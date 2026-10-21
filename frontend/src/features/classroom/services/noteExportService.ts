/** Export saved notes without inference; Markdown is rendered with raw HTML disabled. */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import { NOTE_DOCUMENT_LABEL, NOTE_PRINT_STYLES } from '../constants/notesConstants';
import { lectureNoteFilename } from '../utilities/downloadNotesUtils';
import type { SavedLectureNote } from '../types/notes.types';

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = filename;
  document.body.appendChild(link);
  try { link.click(); } finally { link.remove(); URL.revokeObjectURL(url); }
}

export async function printLectureNotes(note: SavedLectureNote, figures: Record<number, string> = {}, suppliedWindow?: Window) {
  const popup = suppliedWindow ?? window.open('', '_blank');
  if (!popup) throw new Error('Print window blocked');
  popup.opener = null;
  const doc = popup.document;
  doc.title = lectureNoteFilename(note.title);
  doc.documentElement.lang = note.language;
  doc.documentElement.dir = note.direction;
  const style = doc.createElement('style');
  style.textContent = NOTE_PRINT_STYLES;
  doc.head.appendChild(style);
  const append = (tag: string, text: string) => { const element = doc.createElement(tag); element.textContent = text; doc.body.appendChild(element); };
  append('h1', note.title);
  append('p', NOTE_DOCUMENT_LABEL);
  if (note.created_at) {
    const date = new Date(note.created_at);
    if (!Number.isNaN(date.getTime())) append('p', `Lecture date (UTC): ${date.toISOString().slice(0, 10)}`);
  }
  append('p', `Language: ${note.language}`);
  append('hr', '');
  const loaded: Promise<void>[] = [];
  for (const [index, section] of note.sections.entries()) {
    if (section.key_point) append('h2', section.key_point);
    const explanation = doc.createElement('div');
    // React escapes text and ReactMarkdown sanitizes URLs; raw HTML is disabled.
    explanation.innerHTML = renderToStaticMarkup(createElement(ReactMarkdown, { skipHtml: true }, section.explanation));
    doc.body.appendChild(explanation);
    if (section.formula) append('pre', section.formula);
    if (figures[index]) {
      const image = doc.createElement('img');
      image.alt = section.annotation || section.key_point; image.style.maxWidth = '100%';
      loaded.push(new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error('Image loading failed')); }));
      image.src = figures[index]; doc.body.appendChild(image);
    }
    if (section.annotation) append('p', section.annotation);
    if (section.image_source) append('p', section.image_source);
  }
  for (const source of note.sources) append('p', `[${source.number}] ${source.title} — ${source.url}`);
  await Promise.all(loaded);
  popup.focus(); popup.print();
}

export function blobAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Invalid image'));
    reader.onerror = () => reject(new Error('Image could not be read'));
    reader.readAsDataURL(blob);
  });
}
