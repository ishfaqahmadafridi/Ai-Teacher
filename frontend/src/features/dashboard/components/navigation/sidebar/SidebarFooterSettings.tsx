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
    <div className={`space-y-2 ${className}`}>
      {settingsLink && (
        <Link
          href={settingsLink.href}
          aria-label={settingsLink.label}
          title={settingsLink.label}
          onClick={(e) => {
            if (settingsLink.href === '/dashboard' || settingsLink.href === '#') {
              e.preventDefault();
            }
            onSelectTab?.(settingsLink.id);
            onOpenSettings?.();
          }}
          className={`w-full flex items-center gap-3 px-3 md:px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
            isSettingsActive
              ? 'bg-dashboard-selected text-dashboard-primary shadow-none font-bold'
              : 'text-dashboard-muted hover:text-dashboard-text hover:bg-dashboard-subtle/40'
          }`}
        >
          <Settings className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="hidden md:inline">{settingsLink.label}</span>
        </Link>
      )}

    </div>
  );
});

SidebarFooterSettings.displayName = 'SidebarFooterSettings';
