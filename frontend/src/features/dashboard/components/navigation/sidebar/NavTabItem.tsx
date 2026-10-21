'use client';

import { memo } from 'react';
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';
import { SIDEBAR_ICON_MAP } from '../../../constants/sidebarConstants';
import type { NavTabItemProps } from '../../../types/sidebar.types';

export const NavTabItem = memo(function NavTabItem({
  link,
  isActive,
  onSelectTab,
  className = '',
}: NavTabItemProps) {
  const iconComponent = SIDEBAR_ICON_MAP[link.id] ?? (
    <LayoutDashboard className="w-4 h-4 shrink-0" />
  );

  return (
    <Link
      href={link.href}
      title={link.label}
      aria-label={link.label}
      aria-current={isActive ? 'page' : undefined}
      onClick={(e) => {
        if (link.href === '/dashboard' || link.href === '#') {
          e.preventDefault();
        }
        onSelectTab?.(link.id);
      }}
      className={`w-full flex items-center justify-between px-3 md:px-4 py-3 rounded-lg text-sm font-semibold transition-all outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-dashboard-primary ${
        isActive
          ? 'bg-dashboard-selected text-dashboard-primary shadow-[inset_0_0_0_2px_var(--color-dashboard-primary)] font-bold'
          : 'text-dashboard-muted hover:text-dashboard-text hover:bg-dashboard-subtle/40'
      } ${className}`}
    >
      <div className="flex items-center gap-3">
        {iconComponent}
        <span className="hidden md:inline">{link.label}</span>
      </div>
      {link.badgeCount !== undefined && (
        <span
          className={`hidden md:inline px-2 py-0.5 rounded-full text-[10px] font-bold ${
            isActive
              ? 'bg-dashboard-selected text-dashboard-text'
              : 'bg-dashboard-subtle text-dashboard-muted'
          }`}
        >
          {link.badgeCount}
        </span>
      )}
    </Link>
  );
});

NavTabItem.displayName = 'NavTabItem';
