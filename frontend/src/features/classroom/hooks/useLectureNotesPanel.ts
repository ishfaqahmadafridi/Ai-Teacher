'use client';

import { useState, useCallback } from 'react';
import type { LectureNoteItem } from '../types/sidebar.types';
import { downloadNoteAsPdf, downloadNoteAsDocx } from '../utilities/downloadNotesUtils';

export interface UseLectureNotesPanelProps {
  notes: LectureNoteItem[];
  activeTopicId: string;
}

export function useLectureNotesPanel({ notes, activeTopicId }: UseLectureNotesPanelProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [customLangInput, setCustomLangInput] = useState<string>('');
  const [savedCustomLang, setSavedCustomLang] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);

  const currentNote =
    notes.find((note) => note.id === activeTopicId) ||
    notes.find((note) => note.id === 'core-formulae') ||
    notes[0];

  const handleSaveCustomLang = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (customLangInput.trim()) {
      setSavedCustomLang(customLangInput.trim());
      setShowCustomInput(false);
    }
  }, [customLangInput]);

  const handlePillClick = useCallback((id: string) => {
    setSelectedLanguage(id);
    if (id === 'Custom') {
      setShowCustomInput((prev) => !prev);
    } else {
      setShowCustomInput(false);
      setSavedCustomLang('');
    }
  }, []);

  const activeLangLabel =
    selectedLanguage === 'Custom'
      ? savedCustomLang.trim() || customLangInput.trim() || 'Custom'
      : selectedLanguage;

  const getNoteText = useCallback(() => {
    if (!currentNote) return '';
    const langLower = activeLangLabel.toLowerCase();
    if (langLower.includes('urdu')) {
      return `موضوع: ${currentNote.title}\nخلاصہ: کسی جسم کا اسقاط (acceleration) اس پر لگنے والی کل قوت کے براہ راست متناسب اور اس کے کمیت (mass) کے بالواسطہ متناسب ہوتا ہے۔\nفارمولا: ${currentNote.formula || 'F = m · a'}`;
    }
    if (langLower.includes('hinglish')) {
      return `Topic: ${currentNote.title}\nSummary: Kisi object ka acceleration us par lagne wali net force ke directly proportional hota hai aur uske mass ke inversely proportional hota hai.\nFormula: ${currentNote.formula || 'F_net = m · a'}`;
    }
    if (langLower.includes('german') || langLower.includes('deutsch')) {
      return `Thema: ${currentNote.title}\nZusammenfassung: Die Beschleunigung eines Objekts ist direkt proportional zur Nettokraft und umgekehrt proportional zu seiner Masse.\nFormel: ${currentNote.formula || 'F_net = m · a'}`;
    }
    return `Topic: ${currentNote.title}\nSummary: ${currentNote.content}\nFormula: ${currentNote.formula || 'F_net = m · a'}`;
  }, [activeLangLabel, currentNote]);

  const handleDownloadPdf = useCallback(() => {
    if (currentNote) {
      downloadNoteAsPdf(
        currentNote.title,
        getNoteText(),
        currentNote.formula,
        activeLangLabel
      );
    }
  }, [currentNote, getNoteText, activeLangLabel]);

  const handleDownloadDocx = useCallback(() => {
    if (currentNote) {
      downloadNoteAsDocx(
        currentNote.title,
        getNoteText(),
        currentNote.formula,
        activeLangLabel
      );
    }
  }, [currentNote, getNoteText, activeLangLabel]);

  return {
    currentNote,
    selectedLanguage,
    customLangInput,
    savedCustomLang,
    showCustomInput,
    activeLangLabel,
    setCustomLangInput,
    handleSaveCustomLang,
    handlePillClick,
    handleDownloadPdf,
    handleDownloadDocx,
  };
}
