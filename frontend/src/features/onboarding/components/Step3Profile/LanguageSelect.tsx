'use client';

import { memo } from 'react';
import { Label } from '@/components/ui/label';
import { Globe } from 'lucide-react';
import { LANGUAGE_OPTIONS } from '../../constants';
import type { LanguageSelectProps } from '../../types';

function LanguageSelectComponent({ value, onChange }: LanguageSelectProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-wider text-[#c6c6cc]">
        Preferred Language
      </Label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full bg-black/30 border border-white/15 rounded-xl pl-10 pr-4 text-white focus:outline-none focus:border-[#b8c3ff] focus:ring-1 focus:ring-[#b8c3ff]/30 transition-all text-sm font-medium appearance-none cursor-pointer"
        >
          {LANGUAGE_OPTIONS.map((lang) => (
            <option key={lang.code} value={lang.name} className="bg-[#0b1220] text-white">
              {lang.flag} {lang.name} ({lang.nativeName})
            </option>
          ))}
        </select>
        <Globe className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}

export const LanguageSelect = memo(LanguageSelectComponent);
LanguageSelect.displayName = 'LanguageSelect';
