'use client';

import { memo } from 'react';
import { Camera } from 'lucide-react';
import { ProfileAvatarMenu } from './ProfileAvatarMenu';
import type { ProfileAvatarHeaderProps } from '../../types/profile.types';

export const ProfileAvatarHeader = memo(function ProfileAvatarHeader({
  avatarUrl,
  studentName,
  showAvatarMenu,
  showAvatarPresets,
  onToggleAvatarMenu,
  onToggleAvatarPresets,
  onCloseAvatarMenu,
  onSelectPresetAvatar,
  onUploadAvatarClick,
  className = '',
}: ProfileAvatarHeaderProps) {
  return (
    <div className={`relative shrink-0 -mt-14 sm:-mt-16 z-30 ${className}`}>
      {/* Avatar Circular Container */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-[#0F172A] bg-[#1E293B] shadow-2xl">
        <img
          src={avatarUrl}
          alt={studentName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Camera Edit Button */}
      <button
        type="button"
        onClick={onToggleAvatarMenu}
        title="Change Profile Avatar"
        aria-label="Change Profile Avatar"
        className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center justify-center shadow-xl transition-transform hover:scale-110 cursor-pointer border border-white/20 active:scale-95"
      >
        <Camera className="w-4 h-4" />
      </button>

      {/* Avatar Options Popover Menu */}
      {showAvatarMenu && (
        <ProfileAvatarMenu
          showAvatarPresets={showAvatarPresets}
          onToggleAvatarPresets={onToggleAvatarPresets}
          onCloseAvatarMenu={onCloseAvatarMenu}
          onSelectPresetAvatar={onSelectPresetAvatar}
          onUploadAvatarClick={onUploadAvatarClick}
        />
      )}
    </div>
  );
});

ProfileAvatarHeader.displayName = 'ProfileAvatarHeader';
