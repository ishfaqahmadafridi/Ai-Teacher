'use client';

import { memo } from 'react';
import type { UserInfoTitleProps } from '../../../types/sidebar.types';

export const UserInfoTitle = memo(function UserInfoTitle({
  studentName,
}: UserInfoTitleProps) {
  return (
    <div className="hidden md:block min-w-0 flex-1">
      <p className="text-sm font-semibold text-dashboard-text tracking-tight truncate leading-tight">
        {studentName}
      </p>
      <p className="mt-1 flex items-center gap-1.5 text-xs text-dashboard-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
        Student
      </p>
    </div>
  );
});

UserInfoTitle.displayName = 'UserInfoTitle';
