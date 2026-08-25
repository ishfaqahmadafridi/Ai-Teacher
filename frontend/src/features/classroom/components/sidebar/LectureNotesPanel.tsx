'use client';

import { memo } from 'react';
import type { LectureNotesPanelProps } from '../../types/sidebar.types';
import { DEFAULT_LECTURE_NOTES, DEFAULT_ACTIVE_TOPIC_ID } from '../../constants/sidebarConstants';
import { useLectureNotesPanel } from '../../hooks/useLectureNotesPanel';
import {
  NoteLanguageSelector,
  NoteCustomInputForm,
  NoteDownloadActionCard,
} from './notes';

export const LectureNotesPanel = memo(function LectureNotesPanel({
  notes = DEFAULT_LECTURE_NOTES,
  activeTopicId = DEFAULT_ACTIVE_TOPIC_ID,
  className = '',
}: LectureNotesPanelProps) {
  const {
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
  } = useLectureNotesPanel({ notes, activeTopicId });

  if (!currentNote) return null;

  return (
    <div className={`space-y-3 font-sans ${className}`}>
      {/* 1. Language & Format Selection Bar */}
      <NoteLanguageSelector
        selectedLanguage={selectedLanguage}
        savedCustomLang={savedCustomLang}
        activeLangLabel={activeLangLabel}
        onPillClick={handlePillClick}
      />

      {/* 2. Custom Language Input Form (Auto-closes when saved) */}
      {selectedLanguage === 'Custom' && showCustomInput && (
        <NoteCustomInputForm
          customLangInput={customLangInput}
          onCustomLangInputChange={setCustomLangInput}
          onSubmit={handleSaveCustomLang}
        />
      )}

      {/* 3. Main Action Card with ALWAYS VISIBLE PDF & DOCX Download Buttons */}
      <NoteDownloadActionCard
        title={currentNote.title}
        activeLangLabel={activeLangLabel}
        onDownloadPdf={handleDownloadPdf}
        onDownloadDocx={handleDownloadDocx}
      />
    </div>
  );
});

LectureNotesPanel.displayName = 'LectureNotesPanel';
