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
    <div className={`relative w-full sm:max-w-[28rem] ${className}`}>
      <Search aria-hidden="true" className="pointer-events-none w-4 h-4 text-dashboard-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
      <input
        type="search"
        aria-label="Search assignments and quizzes"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-11 bg-dashboard-panel border border-dashboard-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-dashboard-text placeholder:text-dashboard-muted placeholder:opacity-100 hover:border-dashboard-muted/50 focus:outline-none focus:border-dashboard-primary focus:ring-2 focus:ring-dashboard-primary/15 transition-colors"
      />
    </div>
  );
});

AssignmentSearchBar.displayName = 'AssignmentSearchBar';
