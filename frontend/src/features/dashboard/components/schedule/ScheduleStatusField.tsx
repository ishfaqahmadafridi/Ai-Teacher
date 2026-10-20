'use client';

import type { ScheduleSlotFieldsProps } from '../../types/schedule.types';

export function ScheduleStatusField({ model }: ScheduleSlotFieldsProps) {
  const { status, setStatus } = model;
  return (
    <>
            {/* 5. Status */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-dashboard-muted uppercase tracking-wider">
                Initial Class Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('upcoming')}
                  className={`p-2.5 rounded-xl text-center border text-xs font-bold transition-all ${
                    status === 'upcoming'
                      ? 'bg-dashboard-selected border-dashboard-primary/40 text-dashboard-primary ring-1 ring-dashboard-primary/20'
                      : 'bg-dashboard-subtle/40 border-dashboard-border/60 text-dashboard-muted hover:bg-dashboard-subtle hover:text-dashboard-muted'
                  }`}
                >
                  Upcoming
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('live')}
                  className={`p-2.5 rounded-xl text-center border text-xs font-bold transition-all ${
                    status === 'live'
                      ? 'bg-dashboard-success/5 border-dashboard-success/40 text-dashboard-success ring-1 ring-dashboard-success/20'
                      : 'bg-dashboard-subtle/40 border-dashboard-border/60 text-dashboard-muted hover:bg-dashboard-subtle hover:text-dashboard-muted'
                  }`}
                >
                  Live Session
                </button>
              </div>
            </div>

    </>
  );
}
