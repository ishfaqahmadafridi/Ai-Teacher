'use client';

import { memo } from 'react';
import { Ban, ShieldAlert } from 'lucide-react';
import type { ClassBehaviorSectionProps } from '../../types/progress.types';

export const ClassBehaviorBanBanner = memo(function ClassBehaviorBanBanner({ handleFineClick, banStatus }: ClassBehaviorSectionProps) {
  const isBanned = banStatus.isBanned;
  return (
    <>
      {/* Top Banner Warning if Banned */}
      {isBanned && (
        <div className="bg-[#EF4444]/20 border-2 border-[#EF4444] rounded-2xl p-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl animate-pulse">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#EF4444] text-white flex items-center justify-center shrink-0 shadow-lg">
              <Ban className="w-6 h-6" />
            </div>
            <div>
              <div className="font-mono text-xs font-black uppercase tracking-widest text-[#FCA5A5] flex items-center gap-2">
                <span>Account Status: Banned</span>
                <span className="px-2 py-0.5 rounded-full bg-[#EF4444] text-white text-[10px]">
                  3/3 Warnings Exceeded
                </span>
              </div>
              <h4 className="font-['Hanken_Grotesk',sans-serif] text-base font-black text-white mt-1">
                Your Account & Email are Permanently Banned from Live Classes
              </h4>
              <p className="text-xs text-[#FECDD3] mt-1 leading-relaxed max-w-2xl">
                Misbehavior and live class disruptions are strictly prohibited. Paying a fine or money is NOT allowed in this app and will not restore account access.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFineClick}
            className="px-4 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>View Ban Policy</span>
          </button>
        </div>
      )}


    </>
  );
});

ClassBehaviorBanBanner.displayName = 'ClassBehaviorBanBanner';
