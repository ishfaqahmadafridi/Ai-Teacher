'use client';

import { memo } from 'react';
import { useAssignmentsHeaderBanner } from '../../hooks';
import { AssignmentsHeaderTitle } from './AssignmentsHeaderTitle';
import { AssignmentSearchBar } from './AssignmentSearchBar';
import { AssignmentFilterTabs } from './AssignmentFilterTabs';
import type { AssignmentsHeaderBannerProps } from '../../types/assignments.types';

export const AssignmentsHeaderBanner = memo(function AssignmentsHeaderBanner({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  onOpenAssignModal,
  totalCount,
  pendingCount,
  className = '',
}: AssignmentsHeaderBannerProps) {
  const { filterTabs } = useAssignmentsHeaderBanner({ totalCount, pendingCount });

  return (
    <div
      className={`bg-dashboard-panel border border-dashboard-border rounded-3xl p-6 sm:p-8 shadow-none space-y-6 ${className}`}
    >
      {/* Top Title & "+ Assign New Work" Button */}
      <AssignmentsHeaderTitle onOpenAssignModal={onOpenAssignModal} />

      {/* Controls Row: Search Input & Category Filter Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Bar */}
        <AssignmentSearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />

        {/* Filter Pills */}
        <AssignmentFilterTabs
          tabs={filterTabs}
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
        />
      </div>
    </div>
  );
});

AssignmentsHeaderBanner.displayName = 'AssignmentsHeaderBanner';
