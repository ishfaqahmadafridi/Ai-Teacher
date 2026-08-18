'use client';

import { memo } from 'react';
import { Clock } from 'lucide-react';
import { AVAILABLE_TIMEZONES } from '../../../constants/settingsConstants';
import type { LocalTimezoneCardProps } from '../../../types/settings.types';

export const LocalTimezoneCard = memo(function LocalTimezoneCard({
  timezone,
  onChangeTimezone,
  className = '',
}: LocalTimezoneCardProps) {
  return (
    <div className={`p-4 rounded-2xl bg-[#090D16] border border-[#1E293B] space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Local Timezone</h4>
          <p className="text-xs text-[#94A3B8]">
            Used to schedule class reminders and assignment deadline countdowns.
          </p>
        </div>
      </div>

      <select
        value={timezone}
        onChange={(e) => onChangeTimezone(e.target.value)}
        className="w-full bg-[#070D1A] border border-[#1E293B] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#38BDF8] cursor-pointer"
      >
        {AVAILABLE_TIMEZONES.map((tz) => (
          <option key={tz} value={tz} className="bg-[#0F172A] text-white">
            {tz}
          </option>
        ))}
      </select>
    </div>
  );
});

LocalTimezoneCard.displayName = 'LocalTimezoneCard';
