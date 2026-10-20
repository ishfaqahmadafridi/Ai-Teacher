'use client';

import { memo } from 'react';
import type { ProfileModalTabNavProps } from '../../types/profile.types';

export const ProfileModalTabNav = memo(function ProfileModalTabNav({
  activeTab,
  onTabChange,
  className = '',
}: ProfileModalTabNavProps) {
  return (
    <div className={`flex border-b border-dashboard-border px-6 sm:px-8 mt-2 ${className}`}>
      <button
        type="button"
        onClick={() => onTabChange('personal')}
        className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
          activeTab === 'personal'
            ? 'border-dashboard-primary text-dashboard-primary'
            : 'border-transparent text-dashboard-muted hover:text-dashboard-text'
        }`}
      >
        Personal Information
      </button>
      <button
        type="button"
        onClick={() => onTabChange('preferences')}
        className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
          activeTab === 'preferences'
            ? 'border-dashboard-primary text-dashboard-primary'
            : 'border-transparent text-dashboard-muted hover:text-dashboard-text'
        }`}
      >
        Preferences & Settings
      </button>
    </div>
  );
});

ProfileModalTabNav.displayName = 'ProfileModalTabNav';
