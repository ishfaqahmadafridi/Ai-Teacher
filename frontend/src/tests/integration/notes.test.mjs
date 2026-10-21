import test from 'node:test';
import assert from 'node:assert/strict';
import ReactMarkdown from 'react-markdown';
import ISO6391 from 'iso-639-1';
import { load as loadModule } from './helpers/loadModule.mjs';
const load = (path, mocks = {}, globals = {}) => loadModule(path, { 'react-markdown': { default: ReactMarkdown }, ...mocks }, globals);

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
  const { printLectureNotes } = load('features/classroom/services/noteExportService.ts', {}, { window: { open: () => popup } });
  await printLectureNotes(note);
  assert.equal(popup.document.documentElement.lang, 'ur');
  assert.equal(popup.document.documentElement.dir, 'rtl');
  assert.equal(elements[0].textContent, '<script>test</script>');
  assert.match(elements.find(element => element.tag === 'div').innerHTML, /V = I × R/);
  assert.equal(printed, 1);
  assert.equal(popup.opener, null);
});

test('blocked print windows report an actionable failure', async () => {
  const { printLectureNotes } = load('features/classroom/services/noteExportService.ts', {}, { window: { open: () => null } });
  await assert.rejects(() => printLectureNotes(note), /blocked/);
});

test('document downloads release the object URL and remove the link', () => {
  let removed = false;
  const revoked = [];
  const { downloadBlob } = load('features/classroom/services/noteExportService.ts', {}, {
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

test('print export renders emphasis and lists without executing raw HTML', async () => {
  const elements = [];
  const popup = { document: { documentElement: {}, head: { appendChild() {} },
    body: { appendChild(element) { elements.push(element); } }, createElement(tag) { return { tag }; } },
    focus() {}, print() {} };
  const { printLectureNotes } = load('features/classroom/services/noteExportService.ts');
  await printLectureNotes({ ...note, sections: [{ key_point: 'Midbrain',
    explanation: 'The **midbrain** helps.\n\n1. Eye movement\n2. Hearing\n\n<script>alert(1)</script>',
    formula: '', annotation: '' }] }, {}, popup);
  const html = elements.find(element => element.tag === 'div').innerHTML;
  assert.match(html, /<strong>midbrain<\/strong>/);
  assert.match(html, /<ol>/);
  assert.match(html, /<li>Eye movement<\/li>/);
  assert.doesNotMatch(html, /<script>|\*\*midbrain/);
});

test('topic filenames preserve words and remove filesystem control characters', () => {
  const { lectureNoteFilename } = load('features/classroom/utilities/downloadNotesUtils.ts');
  assert.equal(lectureNoteFilename('Midbrain: Visual / Auditory Reflexes?'), 'Midbrain Visual Auditory Reflexes');
  assert.equal(lectureNoteFilename('دماغ'), 'دماغ');
  assert.equal(lectureNoteFilename('...'), 'Lecture notes');
});

test('PDF print title uses the topic and document starts with saved lecture metadata', async () => {
  const elements = [];
  const popup = { document: { documentElement: {}, head: { appendChild() {} },
    body: { appendChild(element) { elements.push(element); } }, createElement(tag) { return { tag }; } },
    focus() {}, print() {} };
  const { printLectureNotes } = load('features/classroom/services/noteExportService.ts');
  await printLectureNotes({ ...note, title: 'Midbrain', created_at: '2026-10-21T09:00:00Z' }, {}, popup);
  assert.equal(popup.document.title, 'Midbrain');
  assert.equal(elements[0].textContent, 'Midbrain');
  assert.ok(elements.some(element => element.textContent === 'Lecture date (UTC): 2026-10-21'));
  assert.ok(elements.some(element => element.textContent === 'Language: ur'));
});

test('selected language blocks original downloads until its translation is ready', async () => {
  const states = [];
  let cursor = 0;
  const downloads = [];
  const source = { ...note, language: 'en', source_language: 'en', direction: 'ltr', figure_indices: [] };
  const auth = Object.assign(selector => selector({ user: { id: 'student' } }), { getState: () => ({ user: { id: 'student' } }) });
  const { useLectureNotesPanel } = load('features/classroom/hooks/useLectureNotesPanel.ts', {
    'iso-639-1': { default: ISO6391 },
    react: { useState(initial) { const index = cursor++; if (!(index in states)) states[index] = initial; return [states[index], value => { states[index] = value; }]; }, useCallback: callback => callback },
    '@tanstack/react-query': { useQuery: () => ({ data: [source] }) },
    '@/features/auth/state/authStore': { useAuthStore: auth },
    '../services/lectureNotesService': { lectureNotesService: {
      translate: async (id, language) => ({ ...source, language, direction: language === 'ur' ? 'rtl' : 'ltr' }),
      document: async (id, language) => { downloads.push(language); return {}; },
    } },
    '../services/noteExportService': { downloadBlob() {} },
    '../utilities/downloadNotesUtils': { lectureNoteFilename: () => 'Topic' },
    '../utilities/noteErrors': { noteErrorMessage: () => 'Translation failed' },
    '../constants/notesConstants': { NOTE_LANGUAGE_CODES: { Urdu: 'ur', Hindi: 'hi', English: 'en' } },
  });
  // This test deliberately invokes the hook through its mocked state harness.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const render = () => { cursor = 0; return useLectureNotesPanel(); };
  assert.equal(render().translationReady, true);
  for (const [selection, language] of [['Urdu', 'ur'], ['Hindi', 'hi']]) {
    render().handlePillClick(selection);
    assert.equal(render().translationReady, false);
    await render().handleDownloadDocx();
    assert.equal(downloads.includes('en'), false);
    await render().translate();
    assert.equal(render().translationReady, true);
    await render().handleDownloadDocx();
    assert.equal(downloads.at(-1), language);
  }
  render().handlePillClick('Custom');
  render().setCustomLangInput('German');
  render().handleSaveCustomLang();
  assert.equal(render().translationReady, false);
  await render().translate();
  assert.equal(render().translationReady, true);
  await render().handleDownloadDocx();
  assert.equal(downloads.at(-1), 'de');
});
