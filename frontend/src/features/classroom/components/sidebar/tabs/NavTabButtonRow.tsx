'use client';

import { memo, useCallback } from 'react';
import { NavTabIcon } from './NavTabIcon';
import type { NavTabButtonRowProps } from '../../../types/sidebar.types';

export const NavTabButtonRow = memo(function NavTabButtonRow({
  tab,
  isActive,
  onSelectTab,
  className = '',
}: NavTabButtonRowProps) {
  const handleClick = useCallback(() => {
    onSelectTab(tab.id);
  }, [tab.id, onSelectTab]);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-current={isActive ? 'page' : undefined}
      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer group ${
        isActive
          ? 'bg-[#1b2559] border-[#b8c3ff] text-white shadow-lg shadow-[#1b2559]/30'
          : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/5 text-[#c4c5d9]'
      } ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0 pr-2">
        <NavTabIcon
          iconName={tab.iconName}
          className={`w-4 h-4 shrink-0 transition-colors ${
            isActive ? 'text-[#b8c3ff]' : 'text-[#c4c5d9] group-hover:text-white'
          }`}
        />
        <span
          className={`font-['Hanken_Grotesk',sans-serif] text-xs transition-colors truncate ${
            isActive ? 'font-bold text-white' : 'font-medium text-[#c4c5d9] group-hover:text-[#e2e2e8]'
          }`}
        >
          {tab.label}
        </span>
      </div>

      {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
        <span className="bg-[#b8c3ff]/20 text-[#b8c3ff] text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
          {tab.badgeCount}
        </span>
      )}
    </button>
  );
});

NavTabButtonRow.displayName = 'NavTabButtonRow';
