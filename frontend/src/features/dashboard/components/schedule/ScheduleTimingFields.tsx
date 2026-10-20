'use client';

import { formatScheduleTimeSlot } from '../../utilities/scheduleTimeFormat';

import { Calendar, Clock } from 'lucide-react';
import type { ScheduleSlotFieldsProps, DayOfWeek } from '../../types/schedule.types';

export function ScheduleTimingFields({ model }: ScheduleSlotFieldsProps) {
  const { dayOfWeek, setDayOfWeek, timeSlot, setTimeSlot, dayOptions, timeSlotOptions } = model;
  return (
    <>
            {/* 3. Day of Week & Time Slot Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-dashboard-muted uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-dashboard-muted" />
                  Day of Week
                </label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value as DayOfWeek)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dashboard-subtle/80 border border-dashboard-border/80 text-dashboard-text text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                >
                  {dayOptions.map((day) => (
                    <option key={day} value={day} className="bg-dashboard-subtle text-dashboard-text">
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-dashboard-muted uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-dashboard-muted" />
                  Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dashboard-subtle/80 border border-dashboard-border/80 text-dashboard-text text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                >
                  {timeSlotOptions.map((slot) => (
                    <option key={slot} value={slot} className="bg-dashboard-subtle text-dashboard-text">
                      {formatScheduleTimeSlot(slot)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

    </>
  );
}
