'use client';

import { memo } from 'react';
import { Upload, ImageIcon, ChevronDown, X } from 'lucide-react';
import { ProfileCoverPresetGrid } from './ProfileCoverPresetGrid';
import type { ProfileCoverMenuProps } from '../../types/profile.types';

export const ProfileCoverMenu = memo(function ProfileCoverMenu({
  showCoverPresets,
  onToggleCoverPresets,
  onCloseCoverMenu,
  onSelectPresetCover,
  onUploadCoverClick,
  className = '',
}: ProfileCoverMenuProps) {
  return (
    <div className={`absolute right-0 top-11 w-72 bg-dashboard-panel border border-dashboard-border rounded-2xl shadow-none p-4 z-50 animate-in fade-in zoom-in-95 duration-150 font-['Hanken_Grotesk',sans-serif] ${className}`}>
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-dashboard-border">
        <span className="text-xs font-bold text-dashboard-muted uppercase tracking-wider">
          COVER BANNER OPTIONS
        </span>
        <button
          type="button"
          onClick={onCloseCoverMenu}
          aria-label="Close Cover Options"
          className="text-dashboard-muted hover:text-dashboard-text p-1 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Option 1: Upload from Device */}
      <button
        type="button"
        onClick={onUploadCoverClick}
        className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-dashboard-text hover:text-white bg-dashboard-subtle hover:bg-dashboard-primary rounded-xl border border-dashboard-border transition-all cursor-pointer text-left mb-2.5 shadow-none"
      >
        <Upload className="w-4 h-4 text-dashboard-primary" />
        <span>Upload from Device / Gallery</span>
      </button>

      {/* Option 2: Choose Preset Cover */}
      <button
        type="button"
        onClick={onToggleCoverPresets}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-dashboard-text bg-dashboard-subtle hover:bg-dashboard-subtle rounded-xl border border-dashboard-border transition-all cursor-pointer text-left mb-3 shadow-none"
      >
        <div className="flex items-center gap-3">
          <ImageIcon className="w-4 h-4 text-dashboard-primary" />
          <span>Choose Preset Cover</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-dashboard-muted transition-transform ${showCoverPresets ? 'rotate-180' : ''}`} />
      </button>

      {/* Preset Wallpaper Selector */}
      {showCoverPresets && (
        <ProfileCoverPresetGrid onSelectPresetCover={onSelectPresetCover} />
      )}
    </div>
  );
});

ProfileCoverMenu.displayName = 'ProfileCoverMenu';
