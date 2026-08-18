'use client';

import { memo } from 'react';
import {
  ThemeModeCard,
  InterfaceLanguageCard,
  LocalTimezoneCard,
} from './general';
import type { SettingsTabProps } from '../../types/settings.types';

export const GeneralThemeSettingsTab = memo(function GeneralThemeSettingsTab({
  settings,
  onChange,
  className = '',
}: SettingsTabProps) {
  return (
    <div className={`space-y-6 font-['Hanken_Grotesk',sans-serif] ${className}`}>
      {/* Visual Theme System Card */}
      <ThemeModeCard
        themeMode={settings.themeMode}
        onChangeThemeMode={(mode) => onChange('themeMode', mode)}
      />

      {/* Interface Language Card */}
      <InterfaceLanguageCard
        interfaceLanguage={settings.interfaceLanguage}
        onChangeLanguage={(lang) => onChange('interfaceLanguage', lang)}
      />

      {/* Local Timezone Card */}
      <LocalTimezoneCard
        timezone={settings.timezone}
        onChangeTimezone={(tz) => onChange('timezone', tz)}
      />
    </div>
  );
});

GeneralThemeSettingsTab.displayName = 'GeneralThemeSettingsTab';
