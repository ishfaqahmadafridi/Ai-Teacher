'use client';

import { memo } from 'react';
import { FilterPillButton } from './FilterPillButton';
import { RosterSearchInput } from './RosterSearchInput';
import type { StudentsModalFilterBarProps } from '../../../types/sidebar.types';

export const StudentsModalFilterBar = memo(function StudentsModalFilterBar({
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  totalCount,
  presentCount,
  absentCount,
  className = '',
}: StudentsModalFilterBarProps) {
  return (
    <div className={`p-4 md:p-5 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 ${className}`}>
      {/* Search Bar */}
      <RosterSearchInput value={searchQuery} onChange={onSearchChange} />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
        <FilterPillButton
          id="all"
          label="All"
          count={totalCount}
          isActive={filter === 'all'}
          activeColor="bg-[#b8c3ff]"
          onClick={onFilterChange}
        />
        <FilterPillButton
          id="present"
          label="Present"
          count={presentCount}
          isActive={filter === 'present'}
          activeColor="bg-[#6ffbbe]"
          onClick={onFilterChange}
        />
        <FilterPillButton
          id="absent"
          label="Absent"
          count={absentCount}
          isActive={filter === 'absent'}
          activeColor="bg-[#ffb4ab]"
          onClick={onFilterChange}
        />
      </div>
    </div>
  );
});

StudentsModalFilterBar.displayName = 'StudentsModalFilterBar';
