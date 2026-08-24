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
      onClick={(e) => {
        if (link.href === '/dashboard' || link.href === '#') {
          e.preventDefault();
        }
        onSelectTab?.(link.id);
      }}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
        isActive
          ? 'bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20 font-bold'
          : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]/40'
      } ${className}`}
    >
      <div className="flex items-center gap-3">
        {iconComponent}
        <span>{link.label}</span>
      </div>
      {link.badgeCount !== undefined && (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            isActive
              ? 'bg-white/20 text-white'
              : 'bg-[#1E293B] text-[#94A3B8]'
          }`}
        >
          {link.badgeCount}
        </span>
      )}
    </Link>
  );
});

NavTabItem.displayName = 'NavTabItem';
