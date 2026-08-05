'use client';

import { memo } from 'react';
import { FilterPillButton } from './FilterPillButton';
import { RosterSearchInput } from './RosterSearchInput';
import type { StudentsModalFilterBarProps } from '../../types/sidebar.types';

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
    <div className={`p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-white/5 ${className}`}>
      {/* Filter Pills Sub-components */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <FilterPillButton
          id="all"
          label="All"
          count={totalCount}
          isActive={filter === 'all'}
          activeColor="bg-[#2e5bff]"
          onClick={onFilterChange}
        />
        <FilterPillButton
          id="present"
          label="Present"
          count={presentCount}
          isActive={filter === 'present'}
          activeColor="bg-[#00a572]"
          onClick={onFilterChange}
        />
        <FilterPillButton
          id="absent"
          label="Absent"
          count={absentCount}
          isActive={filter === 'absent'}
          activeColor="bg-[#93000a]"
          onClick={onFilterChange}
        />
      </div>

      {/* Roster Search Input Sub-component */}
      <RosterSearchInput value={searchQuery} onChange={onSearchChange} />
    </div>
  );
});

StudentsModalFilterBar.displayName = 'StudentsModalFilterBar';
