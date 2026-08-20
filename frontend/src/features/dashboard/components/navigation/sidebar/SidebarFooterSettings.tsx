'use client';

import { memo } from 'react';
import Link from 'next/link';
import type { SidebarFooterSettingsProps } from '../../../types/sidebar.types';

export const SidebarFooterSettings = memo(function SidebarFooterSettings({
  settingsLink,
  activeTabId,
  studentName,
  onSelectTab,
  onOpenProfile,
  onOpenSettings,
  className = '',
}: SidebarFooterSettingsProps) {
  const isSettingsActive = settingsLink ? activeTabId === settingsLink.id : false;

  return (
    <div className={`pt-4 border-t border-[#1E293B] space-y-2 ${className}`}>
      {settingsLink && (
        <Link
          href={settingsLink.href}
          onClick={() => {
            onSelectTab?.(settingsLink.id);
            onOpenSettings?.();
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
            isSettingsActive
              ? 'bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20 font-bold'
              : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]/40'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
          <span>{settingsLink.label}</span>
        </Link>
      )}

      <button
        type="button"
        onClick={onOpenProfile}
        aria-label={`View account profile for ${studentName}`}
        className="w-full flex items-center justify-between px-4 py-2 text-[11px] font-medium text-[#64748B] hover:text-white transition-colors text-left"
      >
        <span>Account Profile</span>
        <span className="text-[10px] text-[#8B5CF6]">View &rarr;</span>
      </button>
    </div>
  );
});

SidebarFooterSettings.displayName = 'SidebarFooterSettings';
