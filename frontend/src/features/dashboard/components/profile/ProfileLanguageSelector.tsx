'use client';

import { memo } from 'react';
import { Globe } from 'lucide-react';
import type { ProfileLanguageSelectorProps } from '../../types/profile.types';

export const ProfileLanguageSelector = memo(function ProfileLanguageSelector({
  preferredLanguage = 'English',
  onChange,
  className = '',
}: ProfileLanguageSelectorProps) {
  return (
    <div className={className}>
      <label
        htmlFor="profile-language"
        className="block text-xs font-semibold text-dashboard-muted uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
      >
        <Globe className="w-3.5 h-3.5 text-dashboard-primary" /> Preferred Teaching Language
      </label>
      <select
        id="profile-language"
        name="preferredLanguage"
        value={preferredLanguage}
        onChange={onChange}
        className="w-full bg-dashboard-subtle border border-dashboard-border rounded-xl px-3.5 py-2.5 text-sm text-dashboard-text focus:outline-none focus:border-dashboard-primary transition-colors cursor-pointer"
      >
        <option value="English">English</option>
        <option value="Urdu">Urdu (اردو)</option>
        <option value="Arabic">Arabic (العربية)</option>
        <option value="French">French (Français)</option>
        <option value="Hindi">Hindi (हिंदी)</option>
      </select>
    </div>
  );
});

ProfileLanguageSelector.displayName = 'ProfileLanguageSelector';
