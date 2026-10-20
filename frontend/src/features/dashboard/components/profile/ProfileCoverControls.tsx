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
        className="dashboard-button dashboard-button-secondary bg-dashboard-panel"
      >
        <ImageIcon className="w-4 h-4 text-dashboard-muted" />
        <span>Change Cover</span>
      </button>

      {/* Close Button */}
      <button
        type="button"
        onClick={onCloseModal}
        aria-label="Close Profile Modal"
        className="dashboard-button dashboard-button-secondary dashboard-button-icon bg-dashboard-panel"
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
