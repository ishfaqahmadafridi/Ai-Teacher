'use client';

import { memo } from 'react';
import { LayoutGrid } from 'lucide-react';
import type { AutoBlackboardCardProps } from '../../../types/settings.types';

export const AutoBlackboardCard = memo(function AutoBlackboardCard({
  autoBlackboardDiagrams,
  onToggleAutoBlackboard,
  className = '',
}: AutoBlackboardCardProps) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-2xl bg-[#090D16] border border-[#1E293B] ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] shrink-0">
          <LayoutGrid className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Automated Blackboard Diagrams</h4>
          <p className="text-xs text-[#94A3B8]">
            Auto-generate physics blackboard diagrams during live teacher explanations.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggleAutoBlackboard}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          autoBlackboardDiagrams ? 'bg-[#10B981]' : 'bg-[#1E293B]'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
            autoBlackboardDiagrams ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
});

AutoBlackboardCard.displayName = 'AutoBlackboardCard';
