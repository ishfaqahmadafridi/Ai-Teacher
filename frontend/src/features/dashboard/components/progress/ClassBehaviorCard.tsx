'use client';

import { memo, useCallback } from 'react';
import { AlertTriangle, ShieldCheck, Zap, Activity, ShieldAlert, Ban } from 'lucide-react';
import { checkBanStatus } from '../../utilities/progressUtils';
import type { ClassBehaviorCardProps } from '../../types/progress.types';

export const ClassBehaviorCard = memo(function ClassBehaviorCard({
  metrics,
  onAttemptUnban,
  className = '',
}: ClassBehaviorCardProps) {
  const banStatus = checkBanStatus(metrics);
  const isBanned = banStatus.isBanned;

  const handleFineClick = useCallback(() => {
    if (onAttemptUnban) {
      onAttemptUnban();
      return;
    }
    alert(
      '⚠️ PAYMENT NOT ALLOWED:\n\nPaying money or fines for misbehavior is strictly NOT allowed in this application. Your account and email remain banned due to exceeding 3/3 live class disruption warnings.'
    );
  }, [onAttemptUnban]);

  return (
    <div
      className={`bg-[#0F172A] border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 ${
        isBanned ? 'border-[#EF4444]/60 bg-[#160B0E]' : 'border-[#1E293B]'
      } ${className}`}
    >
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

      {/* Behavior Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Focus Level */}
        <div className="bg-[#090D16] p-4 rounded-2xl border border-[#1E293B] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#94A3B8] font-medium flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#38BDF8]" />
              Focus Level Index
            </span>
            <span className="font-mono font-bold text-[#38BDF8]">
              {metrics.focusLevelPercent}%
            </span>
          </div>
          <div className="w-full bg-[#1E293B] h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#2563EB] to-[#38BDF8] h-full rounded-full transition-all duration-500"
              style={{ width: `${metrics.focusLevelPercent}%` }}
            />
          </div>
        </div>

        {/* Interaction Quality */}
        <div className="bg-[#090D16] p-4 rounded-2xl border border-[#1E293B] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#94A3B8] font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              Interaction Quality
            </span>
            <span className="font-mono font-bold text-[#10B981]">
              {metrics.interactionQualityPercent}%
            </span>
          </div>
          <div className="w-full bg-[#1E293B] h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#059669] to-[#10B981] h-full rounded-full transition-all duration-500"
              style={{ width: `${metrics.interactionQualityPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

ClassBehaviorCard.displayName = 'ClassBehaviorCard';
