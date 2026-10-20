'use client';

import { memo } from 'react';
import { Globe } from 'lucide-react';
import { useNoteLanguageSelector } from '../../../hooks/useNoteLanguageSelector';
import type { NoteLanguageSelectorProps } from '../../../types/sidebar.types';

export const NoteLanguageSelector = memo(function NoteLanguageSelector({
  selectedLanguage,
  savedCustomLang,
  activeLangLabel,
  onPillClick,
  className = '',
}: NoteLanguageSelectorProps) {
  const options = useNoteLanguageSelector(savedCustomLang);

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between px-0.5">
        <span className="text-[11px] font-bold text-dashboard-muted flex items-center gap-1.5 font-['Hanken_Grotesk',sans-serif]">
          <Globe className="w-3.5 h-3.5 text-dashboard-primary" />
          Note Language & Style
        </span>
        <span className="text-[10px] font-mono font-bold text-dashboard-primary bg-violet-500/15 px-2 py-0.5 rounded-md border border-violet-500/30 truncate max-w-[120px] capitalize">
          {activeLangLabel}
        </span>
      </div>

      {/* 4 Pills Grid */}
      <div className="grid grid-cols-5 gap-1 p-1 rounded-xl bg-dashboard-subtle border border-dashboard-border">
        {options.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onPillClick(item.id)}
            className={`py-1.5 px-1 rounded-lg text-[10px] font-mono font-bold text-center transition-all cursor-pointer truncate ${
              selectedLanguage === item.id
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-dashboard-text shadow-md'
                : 'text-dashboard-muted hover:text-dashboard-primary hover:bg-dashboard-selected/60'
            }`}
            title={item.id === 'Custom' ? 'Click to open or edit custom format' : undefined}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
});

NoteLanguageSelector.displayName = 'NoteLanguageSelector';
