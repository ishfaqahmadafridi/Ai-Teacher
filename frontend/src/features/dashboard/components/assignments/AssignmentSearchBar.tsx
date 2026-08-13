'use client';

import { memo } from 'react';
import { Search } from 'lucide-react';
import type { AssignmentSearchBarProps } from '../../types/assignments.types';

export const AssignmentSearchBar = memo(function AssignmentSearchBar({
  searchQuery,
  onSearchChange,
  placeholder = 'Search assignments & quizzes...',
  className = '',
}: AssignmentSearchBarProps) {
  return (
    <div className={`relative w-full lg:w-80 ${className}`}>
      <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#090D16] border border-[#1E293B] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#8B5CF6] transition-all"
      />
    </div>
  );
});

AssignmentSearchBar.displayName = 'AssignmentSearchBar';
