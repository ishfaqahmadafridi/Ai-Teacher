'use client';

import { memo } from 'react';
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react';
import { TIMEZONE_OPTIONS } from '../../constants';
import type { TimezoneSelectProps } from '../../types';

function TimezoneSelectComponent({ value, onChange }: TimezoneSelectProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-wider text-[#c6c6cc]">
        Timezone
      </Label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full bg-black/30 border border-white/15 rounded-xl pl-10 pr-4 text-white focus:outline-none focus:border-[#b8c3ff] focus:ring-1 focus:ring-[#b8c3ff]/30 transition-all text-sm font-medium appearance-none cursor-pointer"
        >
          {TIMEZONE_OPTIONS.map((tz) => (
            <option key={tz.value} value={tz.value} className="bg-[#0b1220] text-white">
              {tz.label} ({tz.offset})
            </option>
          ))}
        </select>
        <Clock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}

export const TimezoneSelect = memo(TimezoneSelectComponent);
TimezoneSelect.displayName = 'TimezoneSelect';
