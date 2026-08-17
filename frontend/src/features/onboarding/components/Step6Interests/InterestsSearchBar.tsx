'use client';

import { memo } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { InterestsSearchBarProps } from '../../types';

function InterestsSearchBarComponent({
  searchQuery,
  onSearchChange,
  onAddCustom,
}: InterestsSearchBarProps) {
  return (
    <div className="relative font-['Hanken_Grotesk',sans-serif]">
      <div className="relative flex items-center">
        <Search className="w-5 h-5 text-[#94A3B8] absolute left-4 pointer-events-none" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search subjects or fields (e.g., Computer Science, MBBS, Economics)..."
          className="h-14 bg-[#070D1A]/90 border border-[#1E293B] backdrop-blur-xl rounded-2xl pl-12 pr-28 text-white placeholder:text-[#94A3B8] text-sm focus-visible:ring-[#2563EB] shadow-xl"
        />
        {searchQuery.trim().length > 0 && (
          <Button
            type="button"
            onClick={() => onAddCustom(searchQuery)}
            className="absolute right-2 h-10 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </Button>
        )}
      </div>
    </div>
  );
}

export const InterestsSearchBar = memo(InterestsSearchBarComponent);
InterestsSearchBar.displayName = 'InterestsSearchBar';
