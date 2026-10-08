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
        className={`w-full rounded-xl border p-3 text-left text-sm font-semibold ${preferredTime === 'custom' ? 'border-purple-500 bg-purple-600/20 text-white' : 'border-slate-700 text-slate-300'}`}>
        Custom study hours — choose your own time
      </button>
      {preferredTime === 'custom' && (
        <div className="grid grid-cols-2 gap-3">
          <label className="space-y-2 text-sm text-slate-300">Start time<input type="time" required value={startTime} onChange={(e) => onStartTimeChange(e.target.value)} className="block w-full rounded-lg border border-slate-600 bg-slate-800 p-2 text-white [color-scheme:dark]" /></label>
          <label className="space-y-2 text-sm text-slate-300">End time<input type="time" required value={endTime} onChange={(e) => onEndTimeChange(e.target.value)} className="block w-full rounded-lg border border-slate-600 bg-slate-800 p-2 text-white [color-scheme:dark]" /></label>
        </div>
      )}
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
