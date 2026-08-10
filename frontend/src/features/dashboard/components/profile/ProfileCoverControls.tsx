'use client';

import { memo } from 'react';
import { ImageIcon, X } from 'lucide-react';
import { ProfileCoverMenu } from './ProfileCoverMenu';
import type { ProfileCoverControlsProps } from '../../types/profile.types';

export const ProfileCoverControls = memo(function ProfileCoverControls({
  showCoverMenu,
  showCoverPresets,
  onToggleCoverMenu,
  onToggleCoverPresets,
  onCloseCoverMenu,
  onSelectPresetCover,
  onUploadCoverClick,
  onCloseModal,
  className = '',
}: ProfileCoverControlsProps) {
  return (
    <div className={`relative flex items-center gap-2 ${className}`}>
      {/* Change Cover Button */}
      <button
        type="button"
        onClick={onToggleCoverMenu}
        title="Change Cover Banner"
        aria-label="Change Cover Banner"
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-xs font-medium text-white border border-white/20 transition-all shadow-lg cursor-pointer active:scale-95"
      >
        <ImageIcon className="w-4 h-4 text-[#38BDF8]" />
        <span>Change Cover</span>
      </button>

      {/* Close Button */}
      <button
        type="button"
        onClick={onCloseModal}
        aria-label="Close Profile Modal"
        className="p-2 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white/80 hover:text-white transition-colors cursor-pointer border border-white/20"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Cover Banner Options Popover Menu */}
      {showCoverMenu && (
        <ProfileCoverMenu
          showCoverPresets={showCoverPresets}
          onToggleCoverPresets={onToggleCoverPresets}
          onCloseCoverMenu={onCloseCoverMenu}
          onSelectPresetCover={onSelectPresetCover}
          onUploadCoverClick={onUploadCoverClick}
        />
      )}
    </div>
  );
});

ProfileCoverControls.displayName = 'ProfileCoverControls';
