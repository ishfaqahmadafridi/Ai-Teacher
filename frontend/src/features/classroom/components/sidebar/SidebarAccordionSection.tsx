'use client';

import { memo } from 'react';
import { ChevronDown } from 'lucide-react';
import type { SidebarAccordionSectionProps } from '../../types/sidebar.types';

export const SidebarAccordionSection = memo(function SidebarAccordionSection({
  id,
  title,
  badge,
  icon: Icon,
  isExpanded,
  onToggle,
  children,
  className = '',
}: SidebarAccordionSectionProps) {
  return (
    <div
      className={`rounded-2xl bg-[#090D16]/90 border border-slate-800/90 overflow-hidden transition-all duration-300 shadow-md ${
        isExpanded ? 'border-slate-700/80 shadow-slate-950/60' : 'hover:border-slate-700/50'
      } ${className}`}
    >
      {/* Section Header Button */}
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full p-3.5 flex items-center justify-between gap-3 text-left cursor-pointer hover:bg-slate-800/40 transition-colors group select-none font-['Hanken_Grotesk',sans-serif]"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`p-2 rounded-xl transition-colors ${
              isExpanded
                ? 'bg-violet-600/25 text-violet-300 border border-violet-500/40'
                : 'bg-slate-800/60 text-slate-400 border border-slate-700/50 group-hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white tracking-wide truncate">
            {title}
          </span>
          {badge !== undefined && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shrink-0">
              {badge}
            </span>
          )}
        </div>

        {/* Chevron Rotate Arrow */}
        <div
          className={`p-1 rounded-lg text-slate-400 group-hover:text-white transition-all duration-300 ${
            isExpanded ? 'rotate-180 text-violet-400' : 'rotate-0'
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      {/* Expandable Section Content */}
      {isExpanded && (
        <div className="p-3.5 pt-1 border-t border-slate-800/60 animate-in fade-in zoom-in-95 duration-200">
          {children}
        </div>
      )}
    </div>
  );
});

SidebarAccordionSection.displayName = 'SidebarAccordionSection';
