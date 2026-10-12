import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/loadModule.mjs';

const note = { id: '6e33f0c0-2ac3-4ef4-9e27-518dce206fa6', version: 'version', title: '<script>test</script>',
  language: 'ur', source_language: 'en', direction: 'rtl', extra_llm_tokens: 0, sources: [],
  sections: [{ key_point: 'Voltage', explanation: 'V = I × R', formula: 'V = I × R', annotation: 'Circuit' }] };

test('saved notes schema validates structure and rejects missing explanations', () => {
  const { savedLectureNoteSchema } = load('features/classroom/validators/notes.schema.ts');
  assert.equal(savedLectureNoteSchema.parse(note).direction, 'rtl');
  assert.equal(savedLectureNoteSchema.safeParse({ ...note, sections: [{}] }).success, false);
});

test('printing uses safe text nodes and preserves notes language and direction', async () => {
  const elements = [];
  let printed = 0;
  const popup = { document: { documentElement: {}, head: { appendChild() {} },
    body: { appendChild(element) { elements.push(element); } }, createElement(tag) { return { tag, textContent: '' }; } },
    focus() {}, print() { printed += 1; } };
  const { printLectureNotes } = load('features/classroom/utilities/downloadNotesUtils.ts', {}, { window: { open: () => popup } });
  await printLectureNotes(note);
  assert.equal(popup.document.documentElement.lang, 'ur');
  assert.equal(popup.document.documentElement.dir, 'rtl');
  assert.equal(elements[0].textContent, '<script>test</script>');
  assert.equal(printed, 1);
  assert.equal(popup.opener, null);
});

test('blocked print windows report an actionable failure', async () => {
  const { printLectureNotes } = load('features/classroom/utilities/downloadNotesUtils.ts', {}, { window: { open: () => null } });
  await assert.rejects(() => printLectureNotes(note), /blocked/);
});

test('document downloads release the object URL and remove the link', () => {
  let removed = false;
  const revoked = [];
  const { downloadBlob } = load('features/classroom/utilities/downloadNotesUtils.ts', {}, {
    document: { createElement: () => ({ click() {}, remove() { removed = true; } }), body: { appendChild() {} } },
    URL: { createObjectURL: () => 'blob:notes', revokeObjectURL: url => revoked.push(url) },
  });
  downloadBlob({}, 'notes.docx');
  assert.equal(removed, true);
  assert.deepEqual(revoked, ['blob:notes']);
});

test('diagram capture cleanup cancels pending work and aborts its request', () => {
  let cleanup;
  let canceled = false;
  let aborted = false;
  const state = { classroom: { noteId: note.id, currentChunkIndex: 0, diagramType: 'wave' } };
  const { useLectureFigureCapture } = load('features/classroom/hooks/useLectureFigureCapture.ts', {
    '@tanstack/react-query': { useQueryClient: () => ({}) },
    react: { useEffect: effect => { cleanup = effect(); } },
    '@/hooks/useAppStore': { useAppSelector: selector => selector(state) },
    '../services/lectureNotesService': { saveLectureFigure() {} },
    '../utilities/imageUtils': { isImageUrl: () => false },
    '../utilities/lectureFigureCapture': { captureLectureCanvas: () => null },
    '../constants/notesConstants': { LECTURE_FIGURE_CAPTURE_DELAY_MS: 800 },
  }, { AbortController: class { signal = {}; abort() { aborted = true; } },
    setTimeout: () => 1, clearTimeout: () => { canceled = true; } });
  useLectureFigureCapture();
  cleanup();
  assert.equal(canceled, true);
  assert.equal(aborted, true);
});

test('canvas snapshots are resized and empty scenes are not saved', () => {
  const snapshot = { width: 0, height: 0, toDataURL: () => 'data:image/png;base64,PNG', getContext: () => context };
  let pixels = new Uint8ClampedArray([0, 0, 0, 0]);
  const context = { drawImage() {}, getImageData: () => ({ data: pixels }), fillRect() {} };
  const { captureLectureCanvas } = load('features/classroom/utilities/lectureFigureCapture.ts', {
    '../constants/notesConstants': { LECTURE_FIGURE_MAX_DIMENSION: 1600, LECTURE_FIGURE_BACKGROUND: '#0f172a' },
  }, { document: { createElement: () => snapshot } });
  assert.equal(captureLectureCanvas({ width: 3200, height: 1600 }), null);
  pixels = new Uint8ClampedArray([50, 50, 50, 255]);
  assert.equal(captureLectureCanvas({ width: 3200, height: 1600 }), 'PNG');
  assert.equal(snapshot.width, 1600);
  assert.equal(snapshot.height, 800);
});

test('translation validation errors are shown without treating unknown error payloads as text', () => {
  const { noteErrorMessage } = load('features/classroom/utilities/noteErrors.ts', {
    axios: { default: { isAxiosError: () => true } },
  });
  assert.equal(noteErrorMessage({ response: { data: { language: ['Unsupported language'] } } }, 'Retry'), 'Unsupported language');
  assert.equal(noteErrorMessage({ response: { data: '<html>Server error</html>' } }, 'Retry'), 'Retry');
});
