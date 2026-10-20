'use client';

import type { PreferredTimeOfDay } from '../../types/schedule.types';

interface TimetableCustomHoursFieldsProps {
  preferredTime: PreferredTimeOfDay;
  onSelectTime: (time: PreferredTimeOfDay) => void;
  startTime: string;
  onStartTimeChange: (time: string) => void;
  endTime: string;
  onEndTimeChange: (time: string) => void;
  error: string | null;
}

export function TimetableCustomHoursFields({
  preferredTime,
  onSelectTime,
  startTime,
  onStartTimeChange,
  endTime,
  onEndTimeChange,
  error,
}: TimetableCustomHoursFieldsProps) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        aria-pressed={preferredTime === 'custom'}
        onClick={() => onSelectTime('custom')}
        className={`w-full rounded-xl border p-3 text-left text-sm font-semibold ${preferredTime === 'custom' ? 'border-purple-500 bg-purple-600/20 text-dashboard-text' : 'border-dashboard-border text-dashboard-muted'}`}>
        Custom study hours — choose your own time
      </button>
      {preferredTime === 'custom' && (
        <div className="grid grid-cols-2 gap-3">
          <label className="space-y-2 text-sm text-dashboard-muted">Start time<input type="time" required value={startTime} onChange={(e) => onStartTimeChange(e.target.value)} className="block w-full rounded-lg border border-slate-600 bg-dashboard-subtle p-2 text-dashboard-text [color-scheme:dark]" /></label>
          <label className="space-y-2 text-sm text-dashboard-muted">End time<input type="time" required value={endTime} onChange={(e) => onEndTimeChange(e.target.value)} className="block w-full rounded-lg border border-slate-600 bg-dashboard-subtle p-2 text-dashboard-text [color-scheme:dark]" /></label>
        </div>
      )}
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
