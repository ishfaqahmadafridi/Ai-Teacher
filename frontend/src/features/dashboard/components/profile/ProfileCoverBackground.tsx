'use client';

import { memo } from 'react';
import type { ProfileCoverBackgroundProps } from '../../types/profile.types';

export const ProfileCoverBackground = memo(function ProfileCoverBackground({
  coverUrl,
  className = '',
}: ProfileCoverBackgroundProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden rounded-t-3xl ${className}`}>
      <img
        src={coverUrl || '/images/profile_cover.png'}
        alt="Profile Cover Banner"
        className="w-full h-full object-cover opacity-85 transition-opacity duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1E40AF]/30 via-transparent to-[#7C3AED]/30" />
    </div>
  );
});

ProfileCoverBackground.displayName = 'ProfileCoverBackground';
