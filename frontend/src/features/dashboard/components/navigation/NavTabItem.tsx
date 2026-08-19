'use client';

import { memo } from 'react';
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';
import { SIDEBAR_ICON_MAP } from '../../constants/sidebarConstants';
import type { NavTabItemProps } from '../../types/sidebar.types';

export const NavTabItem = memo(function NavTabItem({
  link,
  isActive,
  onSelectTab,
  className = '',
}: NavTabItemProps) {
  const iconComponent = SIDEBAR_ICON_MAP[link.id] ?? (
    <LayoutDashboard className="w-5 h-5 shrink-0" aria-hidden="true" />
  );

  return (
    <Link
      href={link.href}
      onClick={(e) => {
        if (link.href === '/dashboard') {
          e.preventDefault();
        }
        onSelectTab?.(link.id);
      }}
      className={`relative flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 ${
        isActive
          ? 'bg-[#132A5E] text-[#38BDF8] font-bold shadow-lg shadow-[#132A5E]/40'
          : 'text-[#94A3B8] hover:bg-[#121B2D] hover:text-white'
      } ${className}`}
    >
      {isActive && (
        <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-[#00A3FF] rounded-r-full shadow-[0_0_10px_#00A3FF]" />
      )}
      <span className={`transition-colors ${isActive ? 'text-[#38BDF8]' : 'text-[#64748B]'}`}>
        {iconComponent}
      </span>
      <span className="font-['JetBrains_Mono',monospace] text-xs font-semibold uppercase tracking-wider flex-1 truncate">
        {link.label}
      </span>
      {link.badgeCount !== undefined && link.badgeCount !== 0 ? (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00A3FF]/20 text-[#38BDF8] border border-[#00A3FF]/30">
          {link.badgeCount}
        </span>
      ) : null}
    </Link>
  );
});

NavTabItem.displayName = 'NavTabItem';
