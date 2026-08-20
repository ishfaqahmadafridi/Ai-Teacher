'use client';

import { memo } from 'react';
import type { SearchResultRowProps } from '../../../types/topbar.types';

export const SearchResultRow = memo(function SearchResultRow({
  item,
  onSelect,
  className = '',
}: SearchResultRowProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      aria-label={`Select search result ${item.title}`}
      className={`w-full text-left p-2.5 rounded-xl hover:bg-[#1E293B]/80 transition-colors flex items-center justify-between group focus:outline-none focus:ring-1 focus:ring-[#2563EB] ${className}`}
    >
      <div className="min-w-0 pr-2">
        <p className="text-xs font-semibold text-[#F8FAFC] truncate group-hover:text-[#38BDF8] transition-colors">
          {item.title}
        </p>
        <p className="text-[11px] text-[#94A3B8] truncate">{item.subtitle}</p>
      </div>
      <span className="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#1E293B] text-[#38BDF8] border border-[#334155]">
        {item.badgeText}
      </span>
    </button>
  );
});

SearchResultRow.displayName = 'SearchResultRow';
