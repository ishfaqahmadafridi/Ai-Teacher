'use client';

import { memo } from 'react';
import { ShieldCheck, Activity } from 'lucide-react';
import type { ClassBehaviorSectionProps } from '../../types/progress.types';

export const ClassBehaviorHeader = memo(function ClassBehaviorHeader({ metrics, banStatus }: ClassBehaviorSectionProps) {
  const isBanned = banStatus.isBanned;
  return (
    <>
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-5">
        <div>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border ${
              isBanned
                ? 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30'
                : 'bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/20'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Live Class Behavior Tracker</span>
          </div>
          <h3 className="font-['Hanken_Grotesk',sans-serif] text-xl font-bold text-white">
            Class Conduct & Disruption History
          </h3>
        </div>

        {/* Conduct Score Badge */}
        <div className="flex items-center gap-3 bg-[#090D16] p-3 rounded-2xl border border-[#1E293B]">
          <div className="text-right">
            <div className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider">
              Conduct Score
            </div>
            <div
              className={`font-['JetBrains_Mono',monospace] text-xl font-bold ${
                isBanned ? 'text-[#EF4444]' : 'text-[#38BDF8]'
              }`}
            >
              {metrics.conductScore}%
            </div>
          </div>
          <div
            className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
              isBanned
                ? 'bg-[#EF4444]/20 border-[#EF4444]/40 text-[#EF4444]'
                : 'bg-[#2563EB]/20 border-[#2563EB]/40 text-[#38BDF8]'
            }`}
          >
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>


    </>
  );
});

ClassBehaviorHeader.displayName = 'ClassBehaviorHeader';
