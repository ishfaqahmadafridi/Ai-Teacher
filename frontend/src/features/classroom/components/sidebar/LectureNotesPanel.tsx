'use client';
import { memo } from 'react';
import type { LectureNotesPanelProps } from '../../types/sidebar.types';
import { useLectureNotesPanel } from '../../hooks/useLectureNotesPanel';
import { NoteLanguageSelector, NoteDownloadActionCard } from './notes';

export const LectureNotesPanel = memo(function LectureNotesPanel({ className = '' }: LectureNotesPanelProps) {
  const { isSignedIn, currentNote, notes, selectedId, selectNote, selectedLanguage,
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
        <NoteLanguageSelector selectedLanguage={selectedLanguage} disabled={busy} onPillClick={handlePillClick} />
      </fieldset>
      {selectedLanguage !== 'Original' && !translationReady && <div className="space-y-1">
        <button type="button" onClick={translate} disabled={busy} className="rounded-lg bg-dashboard-primary px-3 py-2 text-xs text-white disabled:opacity-50">
          {busy ? 'Working…' : 'Translate'}
        </button>
      </div>}
      {error && <p role="alert" className="text-xs text-dashboard-danger">{error}</p>}
      <fieldset disabled={busy || !translationReady}>
        <NoteDownloadActionCard onDownloadPdf={handleDownloadPdf} onDownloadDocx={handleDownloadDocx} />
      </fieldset>
    </div>
  );
});
LectureNotesPanel.displayName = 'LectureNotesPanel';
