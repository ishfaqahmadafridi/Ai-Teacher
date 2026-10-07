'use client';

import { memo } from 'react';
import { useAuthStore } from '@/features/auth/state/authStore';
import type { UserStatsRowProps } from '../../../types/sidebar.types';

export const UserStatsRow = memo(function UserStatsRow({
  coursesCount,
  streakDays,
}: UserStatsRowProps) {
  const user = useAuthStore((state) => state.user);
  return (
    <div className="min-w-0 space-y-2.5">
      <p className="text-xs leading-relaxed text-slate-400 capitalize break-words">
        {[user?.educationLevel?.replaceAll('_', ' '), user?.academicYear].filter(Boolean).join(' · ') || 'Complete your learning profile'}
      </p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
        <span><strong className="mr-1 font-semibold tabular-nums text-slate-200">{coursesCount}</strong>Courses</span>
        <span><strong className="mr-1 font-semibold tabular-nums text-slate-200">{streakDays}</strong>Streak days</span>
      </div>
    </div>
  );
});

UserStatsRow.displayName = 'UserStatsRow';
