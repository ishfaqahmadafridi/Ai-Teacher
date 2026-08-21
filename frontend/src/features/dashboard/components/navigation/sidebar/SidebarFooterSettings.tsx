'use client';

import { memo } from 'react';
import { Settings } from 'lucide-react';
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
          <Settings className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{settingsLink.label}</span>
        </Link>
      )}

    </div>
  );
});

SidebarFooterSettings.displayName = 'SidebarFooterSettings';
