'use client';

import { memo } from 'react';
import { Button } from '../ui';
import { DEFAULT_SIDEBAR_USER } from '../../constants/askConstants';
import type { SidebarUserProfileProps } from '../../types/ask.types';

export const SidebarUserProfile = memo(function SidebarUserProfile({
  name = DEFAULT_SIDEBAR_USER.name,
  rank = DEFAULT_SIDEBAR_USER.rank,
  initials = DEFAULT_SIDEBAR_USER.initials,
  onClose,
  className = '',
}: SidebarUserProfileProps) {
  return (
    <div className={`flex items-center justify-between mb-8 pb-4 border-b border-white/5 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400">
          {initials}
        </div>
        <div>
          <h3 className="text-sm font-bold text-white leading-tight">{name}</h3>
          <p className="text-[11px] text-slate-400">{rank}</p>
        </div>
      </div>
      {onClose && (
        <Button 
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 bg-transparent border-none cursor-pointer outline-none"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </Button>
      )}
    </div>
  );
});

SidebarUserProfile.displayName = 'SidebarUserProfile';
