'use client';

import { memo } from 'react';
import { ProfileCoverBackground } from './ProfileCoverBackground';
import { ProfileVerifiedBadge } from './ProfileVerifiedBadge';
import { ProfileCoverControls } from './ProfileCoverControls';
import type { ProfileCoverHeaderProps } from '../../types/profile.types';

export const ProfileCoverHeader = memo(function ProfileCoverHeader({
  coverUrl,
  showCoverMenu,
  showCoverPresets,
  onToggleCoverMenu,
  onToggleCoverPresets,
  onCloseCoverMenu,
  onSelectPresetCover,
  onUploadCoverClick,
  onCloseModal,
  className = '',
}: ProfileCoverHeaderProps) {
  return (
    <div className={`relative h-32 sm:h-36 rounded-t-3xl bg-gradient-to-r from-[#1E40AF] via-[#2563EB] to-[#7C3AED] ${className}`}>
      {/* Cover Background Picture Container */}
      <ProfileCoverBackground coverUrl={coverUrl} />

      {/* Banner Controls & Verified Badge */}
      <div className="relative p-5 sm:p-6 flex items-start justify-between z-20">
        <ProfileVerifiedBadge />
        <ProfileCoverControls
          showCoverMenu={showCoverMenu}
          showCoverPresets={showCoverPresets}
          onToggleCoverMenu={onToggleCoverMenu}
          onToggleCoverPresets={onToggleCoverPresets}
          onCloseCoverMenu={onCloseCoverMenu}
          onSelectPresetCover={onSelectPresetCover}
          onUploadCoverClick={onUploadCoverClick}
          onCloseModal={onCloseModal}
        />
      </div>
    </div>
  );
});

ProfileCoverHeader.displayName = 'ProfileCoverHeader';
