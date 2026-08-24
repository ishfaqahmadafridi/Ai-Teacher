'use client';

import { memo } from 'react';
import { UserAvatarBadge } from './UserAvatarBadge';
import { UserInfoTitle } from './UserInfoTitle';
import { UserStatsRow } from './UserStatsRow';
import type { SidebarUserHeaderProps } from '../../../types/sidebar.types';

export const SidebarUserHeader = memo(function SidebarUserHeader({
  studentName,
  studentAvatar,
  streakDays = 128,
  coursesCount = 12,
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
      className={`px-3 py-4 space-y-4 rounded-2xl cursor-pointer hover:bg-[#1E293B]/40 transition-all group border border-transparent hover:border-[#1E293B] ${className}`}
      title="Click to view & edit profile"
    >
      {/* Top Row — Avatar + Name + Badge */}
      <div className="flex items-center gap-4">
        <UserAvatarBadge
          studentAvatar={studentAvatar}
          studentName={studentName}
        />
        <UserInfoTitle studentName={studentName} />
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
