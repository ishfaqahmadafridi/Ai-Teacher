'use client';

import { memo } from 'react';
import type { UserInfoTitleProps } from '../../../types/sidebar.types';

export const UserInfoTitle = memo(function UserInfoTitle({
  studentName,
}: UserInfoTitleProps) {
  return (
    <div className="min-w-0">
      <p className="text-lg font-bold text-white tracking-tight truncate leading-tight">
        {studentName}
      </p>
      <div className="mt-1.5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#7C3AED]/50 bg-[#7C3AED]/10 text-[#C4B5FD] text-[11px] font-bold tracking-widest uppercase">
          {/* Graduation cap icon */}
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 12.5L5.21 11.5 4 12.18V17c0 1.1 3.58 3 8 3s8-1.9 8-3v-4.82l-1.21-.68L12 15.5z" />
          </svg>
          Student
        </span>
      </div>
    </div>
  );
});

UserInfoTitle.displayName = 'UserInfoTitle';
