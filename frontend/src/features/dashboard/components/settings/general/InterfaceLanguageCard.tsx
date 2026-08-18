'use client';

import { memo } from 'react';
import { Globe } from 'lucide-react';
import { AVAILABLE_LANGUAGES } from '../../../constants/settingsConstants';
import type { InterfaceLanguageCardProps } from '../../../types/settings.types';

export const InterfaceLanguageCard = memo(function InterfaceLanguageCard({
  interfaceLanguage,
  onChangeLanguage,
  className = '',
}: InterfaceLanguageCardProps) {
  return (
    <div className={`p-4 rounded-2xl bg-[#090D16] border border-[#1E293B] space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#C4B5FD] shrink-0">
          <Globe className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Interface Language</h4>
          <p className="text-xs text-[#94A3B8]">
            Choose primary language for menus, prompts, and interface controls.
          </p>
        </div>
      </div>

      <select
        value={interfaceLanguage}
        onChange={(e) => onChangeLanguage(e.target.value)}
        className="w-full bg-[#070D1A] border border-[#1E293B] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#38BDF8] cursor-pointer"
      >
        {AVAILABLE_LANGUAGES.map((lang) => (
          <option key={lang} value={lang} className="bg-[#0F172A] text-white">
            {lang}
          </option>
        ))}
      </select>
    </div>
  );
});

InterfaceLanguageCard.displayName = 'InterfaceLanguageCard';
