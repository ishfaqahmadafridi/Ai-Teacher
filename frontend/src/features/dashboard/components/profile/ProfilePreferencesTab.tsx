'use client';

import { memo } from 'react';
import { ProfileLanguageSelector } from './ProfileLanguageSelector';
import { ProfileNotificationToggles } from './ProfileNotificationToggles';
import type { ProfilePreferencesTabProps } from '../../types/profile.types';

export const ProfilePreferencesTab = memo(function ProfilePreferencesTab({
  formData,
  onChange,
  className = '',
}: ProfilePreferencesTabProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Preferred Language */}
      <ProfileLanguageSelector
        preferredLanguage={formData.preferredLanguage}
        onChange={onChange}
      />

      {/* Notification & Security Toggles */}
      <ProfileNotificationToggles />
    </div>
  );
});

ProfilePreferencesTab.displayName = 'ProfilePreferencesTab';
