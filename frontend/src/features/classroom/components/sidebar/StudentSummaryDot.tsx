'use client';

import { memo } from 'react';
import { UserCheck } from 'lucide-react';
import type { StudentSummaryDotProps } from '../../types/sidebar.types';

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
      return <div className={`w-2 h-2 rounded-full bg-[#ffb4ab] ${className}`} />;
    case 'total':
    default:
      return <UserCheck className={`w-4 h-4 text-[#b8c3ff] ${className}`} aria-hidden="true" />;
  }
});

StudentSummaryDot.displayName = 'StudentSummaryDot';
