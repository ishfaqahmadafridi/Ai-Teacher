'use client';
import { useCallback, useMemo } from 'react';
import ISO6391 from 'iso-639-1';
import { NOTE_ORIGINAL_LANGUAGE_OPTION } from '../constants/notesConstants';
import { resolveNoteLanguageCode } from '../utilities/noteLanguage';
import type { NoteLanguageOption } from '../types/sidebar.types';

export function useNoteLanguageSelector(selectedLanguage: string, onSelect: (language: string) => void) {
  const options = useMemo(() => [
    NOTE_ORIGINAL_LANGUAGE_OPTION,
    ...ISO6391.getAllCodes().map(code => ({ value: code, label: `${ISO6391.getName(code)} · ${ISO6391.getNativeName(code)}` })),
  ], []);
  const value = options.find(option => option.value === (resolveNoteLanguageCode(selectedLanguage) || selectedLanguage)) ?? NOTE_ORIGINAL_LANGUAGE_OPTION;
  const handleSelect = useCallback((option: NoteLanguageOption | null) => {
    if (option) onSelect(option.value);
  }, [onSelect]);
  return { options, value, handleSelect };
}
