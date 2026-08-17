'use client';

import { memo } from 'react';
import { ShieldCheck } from 'lucide-react';
import type { ProfileVerifiedBadgeProps } from '../../types/profile.types';

export const ProfileVerifiedBadge = memo(function ProfileVerifiedBadge({
  label = 'Verified Student Account',
  className = '',
}: ProfileVerifiedBadgeProps) {
  return (
    <div className={`flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#38BDF8] border border-white/10 shadow-sm ${className}`}>
      <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
      <span>{label}</span>
    </div>
  );
});

ProfileVerifiedBadge.displayName = 'ProfileVerifiedBadge';
