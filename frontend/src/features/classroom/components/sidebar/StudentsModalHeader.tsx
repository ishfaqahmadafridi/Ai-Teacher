'use client';

import { memo } from 'react';
import { Users, X } from 'lucide-react';
import type { StudentsModalHeaderProps } from '../../types/sidebar.types';

export const StudentsModalHeader = memo(function StudentsModalHeader({
  onClose,
  title = 'Classroom Attendance & Roster',
  subtitle = 'Mathematics 101 • Live Section A',
  className = '',
}: StudentsModalHeaderProps) {
  return (
    <div className={`flex items-center justify-between p-5 md:p-6 border-b border-white/10 bg-[#111318]/50 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#2e5bff]/10 border border-[#2e5bff]/20 flex items-center justify-center text-[#b8c3ff]">
          <Users className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base md:text-lg font-bold text-[#e2e2e8]">
            {title}
          </h2>
          <p className="text-xs text-[#c4c5d9]">
            {subtitle}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close modal"
        className="p-2 rounded-lg text-[#c4c5d9] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
      >
        <X className="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  );
});

StudentsModalHeader.displayName = 'StudentsModalHeader';
