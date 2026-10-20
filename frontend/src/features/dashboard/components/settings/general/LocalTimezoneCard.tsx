'use client';

import { memo } from 'react';
import { Globe2 } from 'lucide-react';
import { AVAILABLE_TIMEZONES } from '../../../constants/settingsConstants';
import type { LocalTimezoneCardProps } from '../../../types/settings.types';

export const LocalTimezoneCard = memo(function LocalTimezoneCard({
  timezone,
  onChangeTimezone,
  className = '',
}: LocalTimezoneCardProps) {
  return (
    <div className={`p-4 rounded-2xl bg-dashboard-panel border border-dashboard-border space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-dashboard-subtle border border-dashboard-border flex items-center justify-center text-dashboard-muted shrink-0">
          <Globe2 aria-hidden="true" strokeWidth={1.75} className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-dashboard-text">Local Timezone</h4>
          <p className="text-xs text-dashboard-muted">
            Used to schedule class reminders and assignment deadline countdowns.
          </p>
        </div>
      </div>

      <select
        value={timezone}
        onChange={(e) => onChangeTimezone(e.target.value)}
        className="w-full bg-dashboard-panel border border-dashboard-border rounded-xl px-4 py-2.5 text-sm text-dashboard-text focus:outline-none focus:border-dashboard-primary cursor-pointer"
      >
        {AVAILABLE_TIMEZONES.map((tz) => (
          <option key={tz} value={tz} className="bg-dashboard-panel text-dashboard-text">
            {tz}
          </option>
        ))}
      </select>
    </div>
  );
});

LocalTimezoneCard.displayName = 'LocalTimezoneCard';
