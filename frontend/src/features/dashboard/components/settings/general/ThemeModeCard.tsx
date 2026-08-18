'use client';

import { memo } from 'react';
import { Moon } from 'lucide-react';
import { THEME_MODE_OPTIONS } from '../../../constants/settingsConstants';
import type { ThemeModeCardProps } from '../../../types/settings.types';

export const ThemeModeCard = memo(function ThemeModeCard({
  themeMode,
  onChangeThemeMode,
  className = '',
}: ThemeModeCardProps) {
  return (
    <div className={`p-4 rounded-2xl bg-[#090D16] border border-[#1E293B] space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
          <Moon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Visual Theme System</h4>
          <p className="text-xs text-[#94A3B8]">
            Select the appearance theme system for the application.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {THEME_MODE_OPTIONS.map((theme) => {
          const isSelected = themeMode === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onChangeThemeMode(theme.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#2563EB]/20 border-[#38BDF8] text-white font-bold'
                  : 'bg-[#070D1A] border-[#1E293B] text-[#94A3B8] hover:text-white'
              }`}
            >
              <div className="font-bold text-xs">{theme.title}</div>
              <div className="text-[11px] opacity-80 mt-0.5">{theme.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
});

ThemeModeCard.displayName = 'ThemeModeCard';
