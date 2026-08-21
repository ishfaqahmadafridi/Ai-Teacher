'use client';

import { memo } from 'react';
import { Search } from 'lucide-react';
import type { RosterSearchInputProps } from '../../../types/sidebar.types';

export const RosterSearchInput = memo(function RosterSearchInput({
  value,
  onChange,
  placeholder = 'Search student...',
  className = '',
}: RosterSearchInputProps) {
  return (
    <div className={`relative w-full sm:w-56 ${className}`}>
      <Search
        className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#c4c5d9]"
        aria-hidden="true"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search student by name or roll number"
        className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 font-['Hanken_Grotesk',sans-serif] text-xs text-[#e2e2e8] placeholder-[#c4c5d9]/60 focus:outline-none focus:border-[#b8c3ff] focus:ring-1 focus:ring-[#b8c3ff] transition-all"
      />
    </div>
  );
});

RosterSearchInput.displayName = 'RosterSearchInput';
