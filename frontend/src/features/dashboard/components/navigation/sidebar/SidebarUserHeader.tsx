'use client';

import { memo } from 'react';
import { UserAvatarBadge } from './UserAvatarBadge';
import { UserInfoTitle } from './UserInfoTitle';
import { UserStatsRow } from './UserStatsRow';
import type { SidebarUserHeaderProps } from '../../../types/sidebar.types';

export const SidebarUserHeader = memo(function SidebarUserHeader({
  studentName,
  studentAvatar,
  streakDays = 0,
  coursesCount = 0,
  onOpenProfile,
  className = '',
}: SidebarUserHeaderProps) {
  return (
    <div
      onClick={onOpenProfile}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenProfile?.();
        }
      }}
      className={`min-w-0 px-2 py-3 space-y-3 rounded-lg cursor-pointer hover:bg-slate-800/40 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${className}`}
      title="Click to view & edit profile"
    >
      {/* Top Row — Avatar + Name + Badge */}
      <div className="flex min-w-0 items-center gap-3.5">
        <UserAvatarBadge
          studentAvatar={studentAvatar}
          studentName={studentName}
        />
        <UserInfoTitle studentName={studentName} />
        <svg className="ml-auto h-4 w-4 shrink-0 text-slate-500 transition-colors group-hover:text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
      </div>

      {/* Stats Row */}
      <UserStatsRow
        coursesCount={coursesCount}
        streakDays={streakDays}
      />
    </div>
  );
});

SidebarUserHeader.displayName = 'SidebarUserHeader';
