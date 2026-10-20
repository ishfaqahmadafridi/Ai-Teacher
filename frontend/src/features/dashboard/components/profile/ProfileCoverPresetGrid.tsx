'use client';

import { memo } from 'react';
import { Grid } from 'lucide-react';
import { PRESET_COVERS } from '../../constants/profileConstants';
import type { ProfileCoverPresetGridProps } from '../../types/profile.types';

export const ProfileCoverPresetGrid = memo(function ProfileCoverPresetGrid({
  onSelectPresetCover,
  className = '',
}: ProfileCoverPresetGridProps) {
  return (
    <div className={`pt-2 border-t border-dashboard-border animate-in fade-in duration-200 ${className}`}>
      <div className="text-[11px] font-semibold text-dashboard-muted mb-2 flex items-center gap-1.5">
        <Grid className="w-3.5 h-3.5 text-dashboard-primary" />
        <span>Select Preset Cover:</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {PRESET_COVERS.map((url, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPresetCover(url)}
            aria-label={`Select Cover Preset ${idx + 1}`}
            className="h-12 rounded-lg overflow-hidden border border-dashboard-border hover:border-dashboard-primary hover:scale-105 transition-all relative group cursor-pointer"
          >
            <img
              src={url}
              alt={`Cover Preset ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
});

ProfileCoverPresetGrid.displayName = 'ProfileCoverPresetGrid';
