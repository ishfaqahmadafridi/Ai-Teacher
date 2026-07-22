'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface InterestsSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddCustom: (subject: string) => void;
}

export function InterestsSearchBar({
  searchQuery,
  onSearchChange,
  onAddCustom,
}: InterestsSearchBarProps) {
  return (
    <div className="relative max-w-xl space-y-2">
      <div className="relative flex items-center">
        <span className="absolute left-4 text-[#909096] pointer-events-none z-10">🔍</span>
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchQuery.trim()) {
              e.preventDefault();
              onAddCustom(searchQuery);
            }
          }}
          placeholder="Search for subjects, skills, or type your own topic..."
          className="h-12 w-full bg-black/40 border-white/10 text-white focus-visible:border-[#0043eb] focus-visible:ring-2 focus-visible:ring-[#0043eb]/50 transition-all placeholder:text-[#909096] text-sm rounded-xl pl-11 pr-28"
        />
        {searchQuery.trim() && (
          <Button
            type="button"
            onClick={() => onAddCustom(searchQuery)}
            className="absolute right-2 h-8 px-3 rounded-lg bg-[#0043eb] hover:bg-[#003ad6] text-white text-xs font-bold transition-all shadow-[0_0_10px_rgba(0,67,235,0.4)] cursor-pointer"
          >
            + Add Custom
          </Button>
        )}
      </div>
    </div>
  );
}
