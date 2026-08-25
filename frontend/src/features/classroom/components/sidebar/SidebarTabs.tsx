'use client';

import { memo } from 'react';
import { ListTree, FileText, Lightbulb } from 'lucide-react';
import type { SidebarTabsProps, ClassroomSidebarTabId } from '../../types/sidebar.types';

export const SidebarTabs = memo(function SidebarTabs({
  activeTab,
  onTabChange,
  className = '',
}: SidebarTabsProps) {
  const tabs: {
    id: ClassroomSidebarTabId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'outline', label: 'Outline', icon: ListTree },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
  ];

  return (
    <div
      className={`bg-[#060A12]/90 p-1.5 rounded-2xl border border-slate-800/80 shadow-inner flex items-center gap-1.5 font-['Hanken_Grotesk',sans-serif] ${className}`}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer ${
              isActive
                ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-600/35 border border-white/20 scale-[1.02]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60 font-semibold'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
});

SidebarTabs.displayName = 'SidebarTabs';
