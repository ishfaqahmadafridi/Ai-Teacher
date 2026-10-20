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
      variant="ghost"
      aria-current={item.isActive ? 'page' : undefined}
      onClick={() => onClick?.(item.id)}
      className={`w-full text-left flex items-center gap-3 p-3.5 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-dashboard-primary/40 focus-visible:ring-offset-2 ${
        item.isActive
          ? 'bg-dashboard-selected text-dashboard-primary hover:bg-dashboard-selected hover:text-dashboard-primary active:bg-dashboard-selected border border-transparent'
          : 'bg-transparent text-dashboard-muted hover:bg-dashboard-subtle hover:text-dashboard-text active:bg-dashboard-subtle border border-transparent'
      } ${className}`}
    >
      <SidebarNavIcon iconName={item.iconName} />
      <span>{item.label}</span>
    </Button>
  );
});

SidebarNavItem.displayName = 'SidebarNavItem';
