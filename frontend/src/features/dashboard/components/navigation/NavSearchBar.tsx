'use client';

import { memo } from 'react';
import { Search } from 'lucide-react';
import type { NavSearchBarProps } from '../../types/topbar.types';

export const NavSearchBar = memo(function NavSearchBar({
  searchQuery,
  onSearchChange,
  placeholder = 'Search classes, assignments, topics...',
  className = '',
}: NavSearchBarProps) {
  return (
    <div className={`relative hidden lg:block ${className}`}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search Dashboard"
        className="bg-[#0F172A] border border-[#1E293B] rounded-full py-2 pl-4 pr-10 text-sm font-['Hanken_Grotesk',sans-serif] text-[#F8FAFC] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] transition-all w-64 md:w-72 outline-none"
      />
      <Search className="w-5 h-5 absolute right-3 top-2.5 text-[#94A3B8]" aria-hidden="true" />
    </div>
  );
});

NavSearchBar.displayName = 'NavSearchBar';
