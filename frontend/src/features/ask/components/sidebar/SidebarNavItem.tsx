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
          ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
          : 'text-slate-400 hover:bg-white/5 border-none bg-transparent hover:text-white'
      } ${className}`}
    >
      <SidebarNavIcon iconName={item.iconName} />
      <span>{item.label}</span>
    </Button>
  );
});

SidebarNavItem.displayName = 'SidebarNavItem';
