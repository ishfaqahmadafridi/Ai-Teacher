'use client';

import { memo } from 'react';
import { Search } from 'lucide-react';
import type { RosterSearchInputProps } from '../../types/sidebar.types';

export const RosterSearchInput = memo(function RosterSearchInput({
  value,
  onChange,
  placeholder = 'Search student...',
  className = '',
}: RosterSearchInputProps) {
  return (
    <div className={`relative w-full sm:w-56 ${className}`}>
      <Search
        className="w-4 h-4 text-[#c4c5d9] absolute left-3 top-1/2 -translate-y-1/2"
        aria-hidden="true"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#111318]/80 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#e2e2e8] placeholder-[#c4c5d9]/50 outline-none focus:border-[#2e5bff]/50"
      />
    </div>
  );
});

RosterSearchInput.displayName = 'RosterSearchInput';
