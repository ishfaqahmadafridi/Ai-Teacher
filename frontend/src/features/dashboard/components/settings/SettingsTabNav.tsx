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
    <div className="flex border-b border-[#1E293B] px-6 overflow-x-auto bg-[#070D1A]/60 font-['Hanken_Grotesk',sans-serif]">
      {TABS.map((tab) => {
        const IconComponent = TAB_ICONS[tab.id];
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 py-3.5 px-4 text-xs font-semibold tracking-wide border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              isActive
                ? 'border-[#2563EB] text-[#38BDF8] bg-[#2563EB]/10'
                : 'border-transparent text-[#94A3B8] hover:text-white hover:border-[#1E293B]'
            }`}
          >
            <IconComponent className="w-4 h-4 shrink-0" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
});

SettingsTabNav.displayName = 'SettingsTabNav';
