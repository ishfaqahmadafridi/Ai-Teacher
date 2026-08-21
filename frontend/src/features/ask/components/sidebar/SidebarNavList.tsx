'use client';

import { memo } from 'react';
import { SidebarNavItem } from './SidebarNavItem';
import { ASK_SIDEBAR_NAV_ITEMS } from '../../constants/askConstants';

export const SidebarNavList = memo(function SidebarNavList() {
  return (
    <nav className="flex-1 space-y-1.5">
      {ASK_SIDEBAR_NAV_ITEMS.map((item) => (
        <SidebarNavItem key={item.id} item={item} />
      ))}
    </nav>
  );
});

SidebarNavList.displayName = 'SidebarNavList';
