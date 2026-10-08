'use client';

import { memo } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { ClassBehaviorSectionProps } from '../../types/progress.types';

export const ClassBehaviorWarnings = memo(function ClassBehaviorWarnings({ metrics, banStatus, handleFineClick }: ClassBehaviorSectionProps) {
  const isBanned = banStatus.isBanned;
  return (
    <>
      {/* Disruption Warning Chances Counter (3 Max) */}
      <div
        className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isBanned
            ? 'bg-[#EF4444]/15 border-[#EF4444]/50'
            : 'bg-gradient-to-r from-[#1E293B]/80 via-[#0F172A] to-[#1E293B]/80 border-[#334155]'
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
              isBanned ? 'bg-[#EF4444] text-white' : 'bg-[#F59E0B]/20 text-[#F59E0B]'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-['Hanken_Grotesk',sans-serif] text-sm font-bold text-white flex items-center gap-2 flex-wrap">
              <span>Rough Behavior / Disruption Chances</span>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold border ${
                  isBanned
                    ? 'bg-[#EF4444] text-white border-[#EF4444]'
                    : 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30'
                }`}
              >
                {banStatus.currentWarnings} / {banStatus.maxAllowed} Warning Chances Used
              </span>
            </h4>
            <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
              {metrics.lastIncidentNote || banStatus.banNotice}
            </p>
          </div>
        </div>

        {/* Action / Warning Notice */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={handleFineClick}
            className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isBanned
                ? 'bg-[#EF4444] text-white border-[#EF4444] hover:bg-[#DC2626]'
                : 'bg-[#1E293B] text-[#94A3B8] border-[#334155] hover:text-white hover:bg-[#334155]'
            }`}
          >
            {isBanned ? 'Banned - Payment Not Allowed' : 'Strict Conduct Rules'}
          </button>
        </div>
      </div>


    </>
  );
});

ClassBehaviorWarnings.displayName = 'ClassBehaviorWarnings';
