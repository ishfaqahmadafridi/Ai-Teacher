'use client';

import { memo } from 'react';
import type { StudentRosterRowProps } from '../../types/sidebar.types';

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
      className={`flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all ${className}`}
    >
      {/* Avatar & Details */}
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-full ${student.avatarBg} text-white font-bold text-xs flex items-center justify-center shadow-sm shrink-0`}
        >
          {initials}
        </div>
        <div>
          <h3 className="text-xs md:text-sm font-semibold text-[#e2e2e8]">
            {student.name}
          </h3>
          <p className="text-[10px] text-[#c4c5d9] font-mono">
            {student.rollNumber}
          </p>
        </div>
      </div>

      {/* Status Badge */}
      <div>
        {isPresent ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold text-[#6ffbbe] bg-[#00a572]/15 border border-[#00a572]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6ffbbe] shadow-[0_0_6px_rgba(111,251,190,0.8)]" />
            Present
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold text-[#ffb4ab] bg-[#93000a]/15 border border-[#ffb4ab]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab]" />
            Absent
          </span>
        )}
      </div>
    </div>
  );
});

StudentRosterRow.displayName = 'StudentRosterRow';
