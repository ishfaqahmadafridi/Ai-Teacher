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
    <div className={`absolute right-0 top-11 w-72 bg-[#0F172A] border border-[#334155] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 font-['Hanken_Grotesk',sans-serif] ${className}`}>
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#1E293B]">
        <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
          COVER BANNER OPTIONS
        </span>
        <button
          type="button"
          onClick={onCloseCoverMenu}
          aria-label="Close Cover Options"
          className="text-[#94A3B8] hover:text-white p-1 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Option 1: Upload from Device */}
      <button
        type="button"
        onClick={onUploadCoverClick}
        className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-white bg-[#1E293B] hover:bg-[#2563EB] rounded-xl border border-[#334155] transition-all cursor-pointer text-left mb-2.5 shadow-sm"
      >
        <Upload className="w-4 h-4 text-[#38BDF8]" />
        <span>Upload from Device / Gallery</span>
      </button>

      {/* Option 2: Choose Preset Cover */}
      <button
        type="button"
        onClick={onToggleCoverPresets}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-white bg-[#1E293B] hover:bg-[#334155] rounded-xl border border-[#334155] transition-all cursor-pointer text-left mb-3 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <ImageIcon className="w-4 h-4 text-[#38BDF8]" />
          <span>Choose Preset Cover</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-[#94A3B8] transition-transform ${showCoverPresets ? 'rotate-180' : ''}`} />
      </button>

      {/* Preset Wallpaper Selector */}
      {showCoverPresets && (
        <ProfileCoverPresetGrid onSelectPresetCover={onSelectPresetCover} />
      )}
    </div>
  );
});

ProfileCoverMenu.displayName = 'ProfileCoverMenu';
