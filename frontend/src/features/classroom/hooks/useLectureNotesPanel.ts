'use client';
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/state/authStore';
import { lectureNotesService } from '../services/lectureNotesService';
import { downloadBlob, printLectureNotes, blobAsDataUrl } from '../services/noteExportService';
import { lectureNoteFilename } from '../utilities/downloadNotesUtils';
import type { SavedLectureNote } from '../types/notes.types';
import { noteErrorMessage } from '../utilities/noteErrors';
import { resolveNoteLanguageCode } from '../utilities/noteLanguage';

export function useLectureNotesPanel() {
  const userId = useAuthStore(state => state.user?.id);
  const query = useQuery({ queryKey: ['lecture-notes', userId], enabled: !!userId,
    queryFn: ({ signal }) => lectureNotesService.list(signal) });
  const [selectedId, setSelectedId] = useState('');
  const [translated, setTranslated] = useState<SavedLectureNote | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('Original');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const source = query.data?.find(note => note.id === selectedId) ?? query.data?.[0];
  const currentNote = translated?.id === source?.id ? translated : source;
  const requestedLanguage = selectedLanguage === 'Original' ? source?.language : resolveNoteLanguageCode(selectedLanguage);
  const translationReady = !!requestedLanguage && currentNote?.language === requestedLanguage;

  const handlePillClick = useCallback((language: string) => {
    setSelectedLanguage(language);
    setTranslated(null);
    setError('');
  }, []);
  const translate = useCallback(async () => {
    if (!source || busy) return;
    const language = requestedLanguage;
    if (!language) { setError('Enter a supported language name or ISO code, such as German or de.'); return; }
    setBusy(true); setError('');
    const account = useAuthStore.getState().user?.id;
    try {
      const result = await lectureNotesService.translate(source.id, language);
      if (account === useAuthStore.getState().user?.id) setTranslated(result);
    } catch (error) { setError(noteErrorMessage(error, 'Translation could not finish. Original notes remain available; retry shortly.')); }
    finally { setBusy(false); }
  }, [source, busy, requestedLanguage]);
  const handleDownloadDocx = useCallback(async () => {
    if (!currentNote || busy || !translationReady) return;
    setBusy(true); setError('');
    const account = useAuthStore.getState().user?.id;
    try {
      const blob = await lectureNotesService.document(currentNote.id, currentNote.language);
      if (account === useAuthStore.getState().user?.id) downloadBlob(blob, `${lectureNoteFilename(currentNote.title)}.docx`);
    } catch { setError('The document could not be downloaded. Please retry.'); }
    finally { setBusy(false); }
  }, [currentNote, busy, translationReady]);
  const handleDownloadPdf = useCallback(async () => {
    if (!currentNote || busy || !translationReady) return;
    const popup = window.open('', '_blank');
    if (!popup) { setError('Allow a print window to save your notes as PDF.'); return; }
    popup.opener = null;
    setBusy(true); setError('');
    const account = useAuthStore.getState().user?.id;
    try {
      const figures = Object.fromEntries(await Promise.all(currentNote.figure_indices.map(async index =>
        [index, await blobAsDataUrl(await lectureNotesService.figure(currentNote.id, index))] as const)));
      if (account === useAuthStore.getState().user?.id) await printLectureNotes(currentNote, figures, popup);
      else popup.close();
    } catch { popup.close(); setError('The printable notes could not be opened. Please retry.'); }
    finally { setBusy(false); }
  }, [currentNote, busy, translationReady]);
  const selectNote = useCallback((id: string) => { setSelectedId(id); setTranslated(null); setSelectedLanguage('Original'); }, []);
  return { isSignedIn: !!userId, currentNote, notes: query.data ?? [], selectedId: source?.id ?? '', selectNote,
    selectedLanguage,
    handlePillClick, handleDownloadPdf, handleDownloadDocx,
    translate, translationReady, busy, error: error || (query.isError ? 'Notes could not be loaded.' : ''), loading: query.isLoading };
}
