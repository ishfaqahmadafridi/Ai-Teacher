'use client';

import { memo } from 'react';
import type { UserAvatarBadgeProps } from '../../../types/sidebar.types';

export const UserAvatarBadge = memo(function UserAvatarBadge({
  studentAvatar,
  studentName,
}: UserAvatarBadgeProps) {
  return (
    <div className="relative shrink-0">
      <div
        className="w-11 h-11 rounded-full border border-dashboard-border bg-dashboard-subtle p-0.5"
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-dashboard-panel">
          {studentAvatar?.trim() ? <img
            src={studentAvatar}
            alt={studentName}
            className="w-full h-full object-cover"
          /> : <span className="flex h-full w-full items-center justify-center text-2xl font-semibold text-dashboard-text" aria-label={studentName}>{studentName?.trim().charAt(0).toUpperCase() || 'S'}</span>}
        </div>
      </div>

    </div>
  );
});

UserAvatarBadge.displayName = 'UserAvatarBadge';
