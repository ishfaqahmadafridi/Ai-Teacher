'use client';

import { memo } from 'react';
import { NavTabItem } from './NavTabItem';
import type { NavTabListProps } from '../../../types/sidebar.types';

export const NavTabList = memo(function NavTabList({
  navLinks,
  activeTabId,
  onSelectTab,
  className = '',
}: NavTabListProps) {
  return (
    <nav className={`flex-1 space-y-1.5 overflow-y-auto pr-1 ${className}`}>
      {navLinks.map((link) => (
        <NavTabItem
          key={link.id}
          link={link}
          isActive={activeTabId === link.id}
          onSelectTab={onSelectTab}
        />
      ))}
    </nav>
  );
});

NavTabList.displayName = 'NavTabList';
