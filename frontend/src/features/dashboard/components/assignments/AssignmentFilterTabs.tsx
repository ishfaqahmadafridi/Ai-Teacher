'use client';

import { memo } from 'react';
import type { AssignmentFilterTabsProps } from '../../types/assignments.types';

export const AssignmentFilterTabs = memo(function AssignmentFilterTabs({
  tabs,
  activeFilter,
  onFilterChange,
  className = '',
}: AssignmentFilterTabsProps) {
  return (
    <div className={`flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 no-scrollbar ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeFilter === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onFilterChange(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
              isActive
                ? 'bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-md'
                : 'bg-[#090D16] text-[#94A3B8] border-[#1E293B] hover:text-white hover:border-[#334155]'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
});

AssignmentFilterTabs.displayName = 'AssignmentFilterTabs';
