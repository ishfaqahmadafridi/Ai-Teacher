'use client';

import { memo } from 'react';
import type { StudentRosterRowProps } from '../../../types/sidebar.types';

export const StudentRosterRow = memo(function StudentRosterRow({
  student,
  className = '',
}: StudentRosterRowProps) {
  const initials = student.name
    .split(' ')
    .map((n) => n[0])
    .join('');
  const isPresent = student.status === 'present';

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-colors ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0 pr-2">
        <div
          className={`w-9 h-9 rounded-full ${student.avatarBg} flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-inner`}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="font-['Hanken_Grotesk',sans-serif] text-xs md:text-sm font-bold text-[#e2e2e8] truncate">
            {student.name}
          </p>
          <p className="font-['Hanken_Grotesk',sans-serif] text-[11px] text-[#c4c5d9]/70 truncate">
            Roll: {student.rollNumber}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`w-2 h-2 rounded-full ${
            isPresent
              ? 'bg-[#6ffbbe] shadow-[0_0_8px_rgba(111,251,190,0.8)]'
              : 'bg-[#ffb4ab] shadow-[0_0_8px_rgba(255,180,171,0.8)]'
          }`}
          aria-hidden="true"
        />
        <span
          className={`text-[11px] font-semibold capitalize ${
            isPresent ? 'text-[#6ffbbe]' : 'text-[#ffb4ab]'
          }`}
        >
          {student.status}
        </span>
      </div>
    </div>
  );
});

StudentRosterRow.displayName = 'StudentRosterRow';
