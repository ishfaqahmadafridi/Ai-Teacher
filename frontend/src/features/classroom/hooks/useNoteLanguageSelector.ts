'use client';
import { useMemo } from 'react';
import ISO6391 from 'iso-639-1';
import { NOTE_LANGUAGE_CODES } from '../constants/notesConstants';
export function useNoteLanguageSelector(savedCustomLang: string) {
  return useMemo(() => [
    { id: 'Original', label: 'Original' },
    ...Object.entries(NOTE_LANGUAGE_CODES).map(([id, code]) => ({ id, label: ISO6391.getNativeName(code) })),
    { id: 'Custom', label: savedCustomLang.trim() || 'Custom' },
  ], [savedCustomLang]);
}
