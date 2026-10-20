'use client';

import { memo } from 'react';
import { Bot, Sliders, Target, GraduationCap, ShieldCheck } from 'lucide-react';
import type { SettingsTabNavProps, SettingsTabId } from '../../types/settings.types';

const TAB_ICONS = {
  ai_mentor: Bot,
  general: Sliders,
  study_goals: Target,
  academic: GraduationCap,
  notifications: ShieldCheck,
};

const TABS: { id: SettingsTabId; label: string }[] = [
  { id: 'ai_mentor', label: 'AI Mentor & Voice' },
  { id: 'general', label: 'General & Theme' },
  { id: 'study_goals', label: 'Daily Goals & Targets' },
  { id: 'academic', label: 'Academic Profile' },
  { id: 'notifications', label: 'Security & Alerts' },
];

export const SettingsTabNav = memo(function SettingsTabNav({
  activeTab,
  onTabChange,
}: SettingsTabNavProps) {
  return (
    <div className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-dashboard-border p-4 bg-dashboard-panel/70 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto font-['Hanken_Grotesk',sans-serif]">
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
                ? 'bg-dashboard-selected text-dashboard-primary shadow-none font-semibold'
                : 'text-dashboard-muted hover:bg-dashboard-subtle/60 hover:text-dashboard-text'
            }`}
          >
            <IconComponent aria-hidden="true" strokeWidth={1.75} className="w-4 h-4 shrink-0" />
            <span className="truncate">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
});

SettingsTabNav.displayName = 'SettingsTabNav';
