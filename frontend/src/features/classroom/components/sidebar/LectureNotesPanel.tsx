'use client';
import { memo } from 'react';
import type { LectureNotesPanelProps } from '../../types/sidebar.types';
import { useLectureNotesPanel } from '../../hooks/useLectureNotesPanel';
import { NoteFigurePreview } from './notes/NoteFigurePreview';
import { NoteLanguageSelector, NoteCustomInputForm, NoteDownloadActionCard } from './notes';

export const LectureNotesPanel = memo(function LectureNotesPanel({ className = '' }: LectureNotesPanelProps) {
  const { isSignedIn, currentNote, notes, selectedId, selectNote, selectedLanguage, customLangInput,
    savedCustomLang, showCustomInput, activeLangLabel, setCustomLangInput, handleSaveCustomLang,
    handlePillClick, handleDownloadPdf, handleDownloadDocx, translate, busy, error, loading } = useLectureNotesPanel();
  if (!currentNote) return <p className="p-3 text-xs text-dashboard-muted" role="status">
    {!isSignedIn ? 'Sign in to save and download lecture notes.' : loading ? 'Loading saved notes…' : error || 'Notes appear automatically after your first completed answer.'}
  </p>;
  return (
    <div className={`space-y-3 font-sans ${className}`}>
      <label className="block text-xs text-dashboard-muted">Saved lecture
        <select value={selectedId} onChange={event => selectNote(event.target.value)} disabled={busy}
          className="mt-1 w-full rounded-lg bg-dashboard-subtle p-2 text-dashboard-text">
          {notes.map(note => <option key={note.id} value={note.id}>{note.title} · {note.version.slice(0, 6)}</option>)}
        </select>
      </label>
      <fieldset disabled={busy}>
      <NoteLanguageSelector selectedLanguage={selectedLanguage} savedCustomLang={savedCustomLang}
        activeLangLabel={activeLangLabel} onPillClick={handlePillClick} />
      {selectedLanguage === 'Custom' && showCustomInput && <NoteCustomInputForm customLangInput={customLangInput}
        onCustomLangInputChange={setCustomLangInput} onSubmit={handleSaveCustomLang} />}
      </fieldset>
      {selectedLanguage !== 'Original' && <div className="space-y-1">
        <p className="text-xs text-dashboard-muted">A new translation uses AI once. Saved translations and downloads use no extra AI tokens.</p>
        <button type="button" onClick={translate} disabled={busy} className="rounded-lg bg-dashboard-primary px-3 py-2 text-xs text-white disabled:opacity-50">
          {busy ? 'Working…' : 'Load or create translation'}
        </button>
      </div>}
      {error && <p role="alert" className="text-xs text-dashboard-danger">{error}</p>}
      <div dir={currentNote.direction} lang={currentNote.language} className="max-h-80 space-y-3 overflow-y-auto rounded-lg bg-dashboard-subtle p-3 text-xs text-dashboard-text">
        {currentNote.sections.map((section, index) => <section key={index}>
          {section.key_point && <h4 className="mb-1 font-semibold text-dashboard-primary">{section.key_point}</h4>}
          <p className="whitespace-pre-wrap leading-relaxed">{section.explanation}</p>
          {section.formula && <p dir="ltr" className="mt-1 font-mono">{section.formula}</p>}
          {currentNote.figure_indices.includes(index) && <NoteFigurePreview noteId={currentNote.id} index={index} caption={section.annotation || section.key_point} />}
          {section.image_source && <a href={section.image_source} target="_blank" rel="noopener noreferrer" className="mt-1 block text-dashboard-primary underline">Lecture image source</a>}
          {section.annotation && <p className="mt-1 text-dashboard-muted">{section.annotation}</p>}
        </section>)}
        {currentNote.sources.map(source => <a key={source.number} href={source.url} target="_blank" rel="noopener noreferrer" className="block text-dashboard-primary underline">
          [{source.number}] {source.title}
        </a>)}
      </div>
      <fieldset disabled={busy}>
        <NoteDownloadActionCard title={currentNote.title} activeLangLabel={activeLangLabel}
          onDownloadPdf={handleDownloadPdf} onDownloadDocx={handleDownloadDocx} />
      </fieldset>
      <p className="text-xs text-dashboard-muted">PDF opens the print dialog. Choose Save as PDF.</p>
    </div>
  );
});
LectureNotesPanel.displayName = 'LectureNotesPanel';
