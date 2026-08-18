'use client';

import { memo } from 'react';
import Link from 'next/link';
import type { SidebarFooterSettingsProps } from '../../types/sidebar.types';

export const SidebarFooterSettings = memo(function SidebarFooterSettings({
  settingsLink,
  activeTabId,
  studentName,
  onSelectTab,
  onOpenProfile,
  onOpenSettings,
  className = '',
}: SidebarFooterSettingsProps) {
  const firstLetter = studentName ? studentName.charAt(0).toUpperCase() : 'S';

  return (
    <div className={`pt-3 mt-2 border-t border-[#162032] ${className}`}>
      <Link
        href={settingsLink?.href || '/dashboard'}
        onClick={(e) => {
          e.preventDefault();
          onSelectTab?.('settings');
          if (onOpenSettings) {
            onOpenSettings();
          } else if (onOpenProfile) {
            onOpenProfile();
          }
        }}
        className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 ${
          activeTabId === 'settings'
            ? 'bg-[#132A5E] text-[#38BDF8] font-bold shadow-lg shadow-[#132A5E]/40'
            : 'text-[#94A3B8] hover:bg-[#121B2D] hover:text-white'
        }`}
      >
        <div className="w-7 h-7 rounded-full bg-[#0F172A] border border-[#1E293B] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-inner">
          {firstLetter}
        </div>
        <span className="font-['JetBrains_Mono',monospace] text-xs font-semibold uppercase tracking-wider flex-1 truncate">
          SETTINGS
        </span>
      </Link>
    </div>
  );
});

SidebarFooterSettings.displayName = 'SidebarFooterSettings';
