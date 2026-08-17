'use client';

import { memo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import type { CountrySearchInputProps } from '../../../types';

export const CountrySearchInput = memo(function CountrySearchInput({
  query,
  isOpen,
  onInputChange,
  onToggleOpen,
}: CountrySearchInputProps) {
  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={onInputChange}
        placeholder="Search or type your country…"
        className="h-12 w-full bg-black/30 border border-white/15 rounded-xl pl-10 pr-11 text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#b8c3ff] focus:ring-1 focus:ring-[#b8c3ff]/30 transition-all text-sm font-medium"
      />

      {/* Left Search Icon */}
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
        <Search className="w-4 h-4" />
      </div>

      {/* Right Down Arrow Toggle Button */}
      <button
        type="button"
        onClick={onToggleOpen}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#c6c6cc] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        title="Toggle country list"
      >
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#38BDF8]' : ''}`} />
      </button>
    </div>
  );
});

CountrySearchInput.displayName = 'CountrySearchInput';
