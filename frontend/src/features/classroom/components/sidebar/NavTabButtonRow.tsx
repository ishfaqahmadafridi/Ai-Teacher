'use client';

import { memo, useCallback } from 'react';
import { NavTabIcon } from './NavTabIcon';
import type { NavTabItem } from '../../types/sidebar.types';

export interface NavTabButtonRowProps {
  tab: NavTabItem;
  isActive: boolean;
  onSelectTab: (id: string) => void;
  className?: string;
}

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
      className={`w-full flex items-center gap-3.5 p-3 rounded-xl font-['Hanken_Grotesk',sans-serif] text-xs font-semibold transition-all duration-200 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2e5bff] ${
        isActive
          ? 'bg-white/10 text-[#e2e2e8] border border-white/10'
          : 'text-[#c4c5d9] hover:text-[#e2e2e8] hover:bg-white/5 border border-transparent'
      } ${className}`}
    >
      <span className="text-[#c4c5d9]">
        <NavTabIcon iconName={tab.iconName} />
      </span>
      <span>{tab.label}</span>
      {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
        <span className="ml-auto bg-[#2e5bff] text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold">
          {tab.badgeCount}
        </span>
      )}
    </button>
  );
});

NavTabButtonRow.displayName = 'NavTabButtonRow';
