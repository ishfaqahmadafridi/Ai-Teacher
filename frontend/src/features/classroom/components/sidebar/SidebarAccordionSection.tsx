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
      className={`rounded-2xl bg-dashboard-panel border border-dashboard-border overflow-hidden transition-all duration-300 shadow-md ${
        isExpanded ? 'border-dashboard-border shadow-sm' : 'hover:border-dashboard-primary/30'
      } ${className}`}
    >
      {/* Section Header Button */}
      <button
        type="button"
        onClick={() => onToggle(id)}
        aria-expanded={isExpanded}
        className="w-full p-3.5 flex items-center justify-between gap-3 text-left cursor-pointer hover:bg-dashboard-selected focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-dashboard-primary transition-colors group select-none font-['Hanken_Grotesk',sans-serif]"
      >
        <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-x-2.5 gap-y-1 min-w-0 flex-1">
          <div
            className={`row-span-2 flex h-9 w-9 items-center justify-center rounded-xl shrink-0 transition-colors ${
              isExpanded
                ? 'bg-blue-500/15 text-dashboard-primary border border-blue-400/30'
                : 'bg-dashboard-subtle text-dashboard-muted border border-dashboard-border group-hover:text-dashboard-primary'
            }`}
          >
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-dashboard-text leading-5">
            {title}
          </span>
          {badge !== undefined && (
            <span className="col-start-2 justify-self-start text-[10px] font-medium px-2 py-0.5 rounded-full bg-dashboard-subtle text-dashboard-muted border border-dashboard-border shrink-0">
              {badge}
            </span>
          )}
        </div>

        {/* Chevron Rotate Arrow */}
        <div
          className={`p-1 rounded-lg text-dashboard-muted group-hover:text-dashboard-primary transition-all duration-300 ${
            isExpanded ? 'rotate-180 text-dashboard-primary' : 'rotate-0'
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      {/* Expandable Section Content */}
      {isExpanded && (
        <div className="p-3.5 pt-1 border-t border-dashboard-border animate-in fade-in zoom-in-95 duration-200">
          {children}
        </div>
      )}
    </div>
  );
});

SidebarAccordionSection.displayName = 'SidebarAccordionSection';
