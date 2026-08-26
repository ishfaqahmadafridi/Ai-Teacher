'use client';

import { memo, useMemo } from 'react';
import { Globe } from 'lucide-react';
import ISO6391 from 'iso-639-1';
import type { NoteLanguageSelectorProps } from '../../../types/sidebar.types';

export const NoteLanguageSelector = memo(function NoteLanguageSelector({
  selectedLanguage,
  savedCustomLang,
  activeLangLabel,
  onPillClick,
  className = '',
}: NoteLanguageSelectorProps) {
  const options = useMemo(() => {
    return [
      { id: 'English', label: ISO6391.getNativeName('en') || 'English' },
      { id: 'Urdu', label: ISO6391.getNativeName('ur') || 'اردو' },
      { id: 'Hinglish', label: 'Hinglish' },
      {
        id: 'Custom',
        label: savedCustomLang.trim() ? savedCustomLang.trim() : 'Custom',
      },
    ];
  }, [savedCustomLang]);

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between px-0.5">
        <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 font-['Hanken_Grotesk',sans-serif]">
          <Globe className="w-3.5 h-3.5 text-violet-400" />
          Note Language & Style
        </span>
        <span className="text-[10px] font-mono font-bold text-violet-300 bg-violet-500/15 px-2 py-0.5 rounded-md border border-violet-500/30 truncate max-w-[120px] capitalize">
          {activeLangLabel}
        </span>
      </div>

      {/* 4 Pills Grid */}
      <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-[#060A12] border border-slate-800">
        {options.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onPillClick(item.id)}
            className={`py-1.5 px-1 rounded-lg text-[10px] font-mono font-bold text-center transition-all cursor-pointer truncate ${
              selectedLanguage === item.id
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
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
