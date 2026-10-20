'use client';

import { memo } from 'react';
import { Palette } from 'lucide-react';
import { THEME_MODE_OPTIONS } from '../../../constants/settingsConstants';
import type { ThemeModeCardProps } from '../../../types/settings.types';

export const ThemeModeCard = memo(function ThemeModeCard({
  themeMode,
  onChangeThemeMode,
  className = '',
}: ThemeModeCardProps) {
  return (
    <div className={`p-4 rounded-2xl bg-dashboard-panel border border-dashboard-border space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-dashboard-subtle border border-dashboard-border flex items-center justify-center text-dashboard-muted shrink-0">
          <Palette aria-hidden="true" strokeWidth={1.75} className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-dashboard-text">Visual Theme System</h4>
          <p className="text-xs text-dashboard-muted">
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
                aria-pressed={isSelected}
              onClick={() => onChangeThemeMode(theme.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-dashboard-selected border-dashboard-primary/50 text-dashboard-text font-semibold'
                  : 'bg-dashboard-panel border-dashboard-border text-dashboard-muted hover:text-dashboard-text'
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
