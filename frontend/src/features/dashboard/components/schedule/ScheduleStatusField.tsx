'use client';

import type { ScheduleSlotFieldsProps } from '../../types/schedule.types';

export function ScheduleStatusField({ model }: ScheduleSlotFieldsProps) {
  const { status, setStatus } = model;
  return (
    <>
            {/* 5. Status */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Initial Class Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('upcoming')}
                  className={`p-2.5 rounded-xl text-center border text-xs font-bold transition-all ${
                    status === 'upcoming'
                      ? 'bg-blue-600/20 border-blue-500/80 text-blue-300 ring-1 ring-blue-500/50'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Upcoming
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('live')}
                  className={`p-2.5 rounded-xl text-center border text-xs font-bold transition-all ${
                    status === 'live'
                      ? 'bg-emerald-600/20 border-emerald-500/80 text-emerald-300 ring-1 ring-emerald-500/50'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  Live Session
                </button>
              </div>
            </div>

    </>
  );
}
