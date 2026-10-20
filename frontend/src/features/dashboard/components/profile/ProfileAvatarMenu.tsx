'use client';

import { memo } from 'react';
import { Upload, User, ChevronDown, X } from 'lucide-react';
import { ProfileAvatarPresetGrid } from './ProfileAvatarPresetGrid';
import type { ProfileAvatarMenuProps } from '../../types/profile.types';

export const ProfileAvatarMenu = memo(function ProfileAvatarMenu({
  showAvatarPresets,
  onToggleAvatarPresets,
  onCloseAvatarMenu,
  onSelectPresetAvatar,
  onUploadAvatarClick,
  className = '',
}: ProfileAvatarMenuProps) {
  return (
    <div className={`absolute left-0 top-24 w-72 bg-dashboard-panel border border-dashboard-border rounded-2xl shadow-none p-4 z-50 animate-in fade-in zoom-in-95 duration-150 font-['Hanken_Grotesk',sans-serif] ${className}`}>
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-dashboard-border">
        <span className="text-xs font-bold text-dashboard-muted uppercase tracking-wider">
          AVATAR OPTIONS
        </span>
        <button
          type="button"
          onClick={onCloseAvatarMenu}
          aria-label="Close Avatar Options"
          className="text-dashboard-muted hover:text-dashboard-text p-1 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Option 1: Upload from Device / Gallery */}
      <button
        type="button"
        onClick={onUploadAvatarClick}
        className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-dashboard-text hover:text-white bg-dashboard-subtle hover:bg-dashboard-primary rounded-xl border border-dashboard-border transition-all cursor-pointer text-left mb-2.5 shadow-none"
      >
        <Upload className="w-4 h-4 text-dashboard-primary" />
        <span>Upload from Device / Gallery</span>
      </button>

      {/* Option 2: Choose Preset Avatar Button */}
      <button
        type="button"
        onClick={onToggleAvatarPresets}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-dashboard-text bg-dashboard-subtle hover:bg-dashboard-subtle rounded-xl border border-dashboard-border transition-all cursor-pointer text-left mb-3 shadow-none"
      >
        <div className="flex items-center gap-3">
          <User className="w-4 h-4 text-dashboard-primary" />
          <span>Choose Preset Avatar</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-dashboard-muted transition-transform ${showAvatarPresets ? 'rotate-180' : ''}`} />
      </button>

      {/* Preset Avatar Selector Grid */}
      {showAvatarPresets && (
        <ProfileAvatarPresetGrid onSelectPresetAvatar={onSelectPresetAvatar} />
      )}
    </div>
  );
});

ProfileAvatarMenu.displayName = 'ProfileAvatarMenu';
