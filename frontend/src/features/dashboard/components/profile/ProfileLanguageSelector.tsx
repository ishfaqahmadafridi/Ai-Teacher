'use client';

import { memo } from 'react';
import { Globe } from 'lucide-react';
import { PROFILE_LANGUAGE_OPTIONS, PROFILE_LANGUAGE_MAX_LENGTH } from '../../constants/profileConstants';
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
      <input
        id="profile-language"
        name="preferredLanguage"
        type="text"
        maxLength={PROFILE_LANGUAGE_MAX_LENGTH}
        list="profile-language-options"
        placeholder="Type or select a language"
        value={preferredLanguage}
        onChange={onChange}
        className="w-full bg-dashboard-subtle border border-dashboard-border rounded-xl px-3.5 py-2.5 text-sm text-dashboard-text focus:outline-none focus:border-dashboard-primary transition-colors"
      />
      <datalist id="profile-language-options">
        {PROFILE_LANGUAGE_OPTIONS.map(language => <option key={language} value={language} />)}
      </datalist>
    </div>
  );
});

ProfileLanguageSelector.displayName = 'ProfileLanguageSelector';
