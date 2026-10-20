'use client';

import { memo } from 'react';
import { Languages } from 'lucide-react';
import { AVAILABLE_LANGUAGES } from '../../../constants/settingsConstants';
import type { InterfaceLanguageCardProps } from '../../../types/settings.types';

export const InterfaceLanguageCard = memo(function InterfaceLanguageCard({
  interfaceLanguage,
  onChangeLanguage,
  className = '',
}: InterfaceLanguageCardProps) {
  return (
    <div className={`p-4 rounded-2xl bg-dashboard-panel border border-dashboard-border space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-dashboard-subtle border border-dashboard-border flex items-center justify-center text-dashboard-muted shrink-0">
          <Languages aria-hidden="true" strokeWidth={1.75} className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-dashboard-text">Interface Language</h4>
          <p className="text-xs text-dashboard-muted">
            Choose primary language for menus, prompts, and interface controls.
          </p>
        </div>
      </div>

      <select
        value={interfaceLanguage}
        onChange={(e) => onChangeLanguage(e.target.value)}
        className="w-full bg-dashboard-panel border border-dashboard-border rounded-xl px-4 py-2.5 text-sm text-dashboard-text focus:outline-none focus:border-dashboard-primary cursor-pointer"
      >
        {AVAILABLE_LANGUAGES.map((lang) => (
          <option key={lang} value={lang} className="bg-dashboard-panel text-dashboard-text">
            {lang}
          </option>
        ))}
      </select>
    </div>
  );
});

InterfaceLanguageCard.displayName = 'InterfaceLanguageCard';
