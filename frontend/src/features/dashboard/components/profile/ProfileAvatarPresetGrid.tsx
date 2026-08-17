'use client';

import { memo } from 'react';
import { Grid } from 'lucide-react';
import { PRESET_AVATARS } from '../../constants/profileConstants';
import type { ProfileAvatarPresetGridProps } from '../../types/profile.types';

export const ProfileAvatarPresetGrid = memo(function ProfileAvatarPresetGrid({
  onSelectPresetAvatar,
  className = '',
}: ProfileAvatarPresetGridProps) {
  return (
    <div className={`pt-2 border-t border-[#1E293B] animate-in fade-in duration-200 ${className}`}>
      <div className="text-[11px] font-semibold text-[#94A3B8] mb-2 flex items-center gap-1.5">
        <Grid className="w-3.5 h-3.5 text-[#38BDF8]" />
        <span>Select Preset Avatar:</span>
      </div>
      <div className="grid grid-cols-4 gap-2.5">
        {PRESET_AVATARS.map((url, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPresetAvatar(url)}
            aria-label={`Select Avatar Preset ${idx + 1}`}
            className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#334155] hover:border-[#38BDF8] transition-all relative group cursor-pointer mx-auto hover:scale-110 shadow-md"
          >
            <img
              src={url}
              alt={`Avatar Preset ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
});

ProfileAvatarPresetGrid.displayName = 'ProfileAvatarPresetGrid';
