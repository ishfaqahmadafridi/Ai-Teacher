'use client';

import { memo } from 'react';
import { Bot, Sliders, Bell, GraduationCap } from 'lucide-react';
import type { SettingsTabNavProps, SettingsTabId } from '../../types/settings.types';

const TAB_ICONS = {
  ai_mentor: Bot,
  general: Sliders,
  notifications: Bell,
  academic: GraduationCap,
};

const TABS: { id: SettingsTabId; label: string }[] = [
  { id: 'ai_mentor', label: 'AI Mentor & Voice' },
  { id: 'general', label: 'General & Theme' },
  { id: 'notifications', label: 'Notifications & Security' },
  { id: 'academic', label: 'Academic Profile' },
];

export const SettingsTabNav = memo(function SettingsTabNav({
  activeTab,
  onTabChange,
}: SettingsTabNavProps) {
  return (
    <div className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-[#1E293B] p-4 bg-[#070D1A]/70 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto font-['Hanken_Grotesk',sans-serif]">
      {TABS.map((tab) => {
        const IconComponent = TAB_ICONS[tab.id];
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap text-left w-full ${
              isActive
                ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/25 font-bold'
                : 'text-[#94A3B8] hover:bg-[#1E293B]/60 hover:text-white'
            }`}
          >
            <IconComponent className="w-4 h-4 shrink-0" />
            <span className="truncate">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
});

SettingsTabNav.displayName = 'SettingsTabNav';
