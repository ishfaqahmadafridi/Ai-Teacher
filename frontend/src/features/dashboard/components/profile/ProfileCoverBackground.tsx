'use client';

import { memo } from 'react';
import type { ProfileCoverBackgroundProps } from '../../types/profile.types';

export const ProfileCoverBackground = memo(function ProfileCoverBackground({
  coverUrl,
  className = '',
}: ProfileCoverBackgroundProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden rounded-t-2xl ${className}`}>
      {coverUrl && (
        <img src={coverUrl} alt="Profile cover" className="w-full h-full object-cover" />
      )}

    </div>
  );
});

ProfileCoverBackground.displayName = 'ProfileCoverBackground';
