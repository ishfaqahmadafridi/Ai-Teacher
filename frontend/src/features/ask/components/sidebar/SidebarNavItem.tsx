'use client';

import { memo } from 'react';
import { Button } from '../ui';
import { SidebarNavIcon } from './SidebarNavIcon';
import type { SidebarNavItemProps } from '../../types/ask.types';

export const SidebarNavItem = memo(function SidebarNavItem({
  item,
  onClick,
  className = '',
}: SidebarNavItemProps) {
  return (
    <Button
      type="button"
      onClick={() => onClick?.(item.id)}
      className={`w-full text-left flex items-center gap-3 p-3.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
        item.isActive
          ? 'bg-dashboard-selected text-dashboard-primary border border-dashboard-border'
          : 'text-dashboard-muted hover:bg-dashboard-subtle border-none bg-transparent hover:text-dashboard-text'
      } ${className}`}
    >
      <SidebarNavIcon iconName={item.iconName} />
      <span>{item.label}</span>
    </Button>
  );
});

SidebarNavItem.displayName = 'SidebarNavItem';
