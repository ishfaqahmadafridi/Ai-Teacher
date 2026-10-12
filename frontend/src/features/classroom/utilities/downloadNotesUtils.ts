/** Export saved notes without inference; DOM text nodes avoid HTML injection. */
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
  doc.title = note.title;
  doc.documentElement.lang = note.language;
  doc.documentElement.dir = note.direction;
  const style = doc.createElement('style');
  style.textContent = 'body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:20px;line-height:1.7}p{white-space:pre-wrap}pre{direction:ltr;text-align:left;white-space:pre-wrap}@media print{body{margin:0}}';
  doc.head.appendChild(style);
  const append = (tag: string, text: string) => { const element = doc.createElement(tag); element.textContent = text; doc.body.appendChild(element); };
  append('h1', note.title);
  const loaded: Promise<void>[] = [];
  for (const [index, section] of note.sections.entries()) {
    if (section.key_point) append('h2', section.key_point);
    append('p', section.explanation);
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
