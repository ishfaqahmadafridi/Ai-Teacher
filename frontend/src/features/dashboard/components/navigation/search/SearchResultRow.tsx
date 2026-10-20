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
      className={`w-full text-left p-2.5 rounded-xl hover:bg-dashboard-subtle/80 transition-colors flex items-center justify-between group focus:outline-none focus:ring-1 focus:ring-dashboard-primary ${className}`}
    >
      <div className="min-w-0 pr-2">
        <p className="text-xs font-semibold text-dashboard-text truncate group-hover:text-dashboard-primary transition-colors">
          {item.title}
        </p>
        <p className="text-[11px] text-dashboard-muted truncate">{item.subtitle}</p>
      </div>
      <span className="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full bg-dashboard-subtle text-dashboard-primary border border-dashboard-border">
        {item.badgeText}
      </span>
    </button>
  );
});

SearchResultRow.displayName = 'SearchResultRow';
