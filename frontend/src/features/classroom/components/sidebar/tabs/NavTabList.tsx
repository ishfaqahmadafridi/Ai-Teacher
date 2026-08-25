'use client';

import { memo } from 'react';
import { useNavTabList } from '../../../hooks/useNavTabList';
import { NavTabButtonRow } from './NavTabButtonRow';
import type { NavTabListProps, NavTabItem } from '../../../types/sidebar.types';

export const NavTabList = memo(function NavTabList({
  activeTabId,
  onSelectTab,
}: NavTabListProps) {
  const { tabs, handleTabClick } = useNavTabList(onSelectTab);

  return (
    <div className="space-y-1.5 pt-2">
      {tabs.map((tab: NavTabItem) => (
        <NavTabButtonRow
          key={tab.id}
          tab={tab}
          isActive={activeTabId === tab.id}
          onSelectTab={handleTabClick}
        />
      ))}
    </div>
  );
});

NavTabList.displayName = 'NavTabList';
