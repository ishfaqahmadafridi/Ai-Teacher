'use client';

import { memo } from 'react';
import { Search, X } from 'lucide-react';
import { useNavSearchBar } from '../../../hooks/useNavSearchBar';
import { NavSearchResultsDropdown } from './NavSearchResultsDropdown';
import type { NavSearchBarProps } from '../../../types/topbar.types';

export const NavSearchBar = memo(function NavSearchBar({
  searchQuery,
  onSearchChange,
  onSelectSearchResult,
  placeholder = 'Search classes, assignments, topics...',
  className = '',
}: NavSearchBarProps) {
  const {
    isOpen,
    containerRef,
    inputRef,
    groupedResults,
    handleFocus,
    handleInputChange,
    handleClear,
    handleSelectResult,
  } = useNavSearchBar({
    searchQuery,
    onSearchChange,
    onSelectSearchResult,
  });

  return (
    <div
      ref={containerRef}
      className={`relative hidden lg:block ${className}`}
    >
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          placeholder={placeholder}
          aria-label="Search Dashboard"
          className="bg-[#0F172A] border border-[#1E293B] rounded-full py-2 pl-4 pr-10 text-sm font-['Hanken_Grotesk',sans-serif] text-[#F8FAFC] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all w-64 md:w-80 outline-none"
        />

        {searchQuery ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear Search Input"
            className="absolute right-3 p-1 rounded-full text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] transition-colors focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        ) : (
          <div className="absolute right-3 flex items-center pointer-events-none text-[#64748B]">
            <Search className="w-4 h-4 text-[#94A3B8]" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Instant Interactive Search Results Dropdown Overlay */}
      <NavSearchResultsDropdown
        isOpen={isOpen}
        searchQuery={searchQuery}
        results={groupedResults}
        onSelectResult={handleSelectResult}
        onClose={handleClear}
      />
    </div>
  );
});

NavSearchBar.displayName = 'NavSearchBar';
