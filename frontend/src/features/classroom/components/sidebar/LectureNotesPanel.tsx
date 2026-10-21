'use client';
import { memo } from 'react';
import type { LectureNotesPanelProps } from '../../types/sidebar.types';
import { useLectureNotesPanel } from '../../hooks/useLectureNotesPanel';
import { NoteLanguageSelector, NoteCustomInputForm, NoteDownloadActionCard } from './notes';

export const LectureNotesPanel = memo(function LectureNotesPanel({ className = '' }: LectureNotesPanelProps) {
  const { isSignedIn, currentNote, notes, selectedId, selectNote, selectedLanguage, customLangInput,
    savedCustomLang, showCustomInput, activeLangLabel, setCustomLangInput, handleSaveCustomLang,
    handlePillClick, handleDownloadPdf, handleDownloadDocx, translate, translationReady, busy, error, loading } = useLectureNotesPanel();
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
      <p className="text-xs text-dashboard-muted" role="status">
        {translationReady ? 'Your complete lecture notes are saved automatically. Download the document below.' : 'Load or create the selected translation before downloading.'}
      </p>
      <fieldset disabled={busy || !translationReady}>
        <NoteDownloadActionCard title={currentNote.title} activeLangLabel={activeLangLabel}
          onDownloadPdf={handleDownloadPdf} onDownloadDocx={handleDownloadDocx} />
      </fieldset>
      <p className="text-xs text-dashboard-muted">PDF opens the print dialog. Choose Save as PDF.</p>
    </div>
  );
});
LectureNotesPanel.displayName = 'LectureNotesPanel';
