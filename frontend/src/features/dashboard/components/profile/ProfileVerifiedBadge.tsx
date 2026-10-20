'use client';

import { memo } from 'react';
import { ShieldCheck } from 'lucide-react';
import type { ProfileVerifiedBadgeProps } from '../../types/profile.types';

export const ProfileVerifiedBadge = memo(function ProfileVerifiedBadge({
  label = 'Verified Student Account',
  className = '',
}: ProfileVerifiedBadgeProps) {
  return (
    <div className={`flex items-center gap-2 bg-dashboard-panel/95 px-3.5 py-1.5 rounded-full text-xs font-semibold text-dashboard-muted border border-dashboard-border shadow-none ${className}`}>
      <ShieldCheck className="w-4 h-4 text-dashboard-success" />
      <span>{label}</span>
    </div>
  );
});

ProfileVerifiedBadge.displayName = 'ProfileVerifiedBadge';
