'use client';

import { memo } from 'react';
import { UserCheck } from 'lucide-react';
import type { StudentSummaryDotProps } from '../../../types/sidebar.types';

export const StudentSummaryDot = memo(function StudentSummaryDot({
  variant,
  className = '',
}: StudentSummaryDotProps) {
  switch (variant) {
    case 'present':
      return (
        <div
          className={`w-2 h-2 rounded-full bg-[#6ffbbe] shadow-[0_0_8px_rgba(111,251,190,0.8)] ${className}`}
        />
      );
    case 'absent':
      return (
        <div
          className={`w-2 h-2 rounded-full bg-[#ffb4ab] shadow-[0_0_8px_rgba(255,180,171,0.8)] ${className}`}
        />
      );
    case 'total':
    default:
      return (
        <UserCheck
          className={`w-3.5 h-3.5 text-[#b8c3ff] shrink-0 ${className}`}
          aria-hidden="true"
        />
      );
  }
});

StudentSummaryDot.displayName = 'StudentSummaryDot';
