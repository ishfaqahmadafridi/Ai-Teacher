'use client';

import { User, MapPin } from 'lucide-react';
import type { ScheduleSlotFieldsProps } from '../../types/schedule.types';

export function ScheduleLocationFields({ model }: ScheduleSlotFieldsProps) {
  const { instructorName, setInstructorName, roomOrLink, setRoomOrLink } = model;
  return (
    <>
            {/* 4. Instructor & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  Instructor Name
                </label>
                <input
                  type="text"
                  value={instructorName}
                  onChange={(e) => setInstructorName(e.target.value)}
                  placeholder="e.g. Dr. Sarah Jenkins"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  Room or Session Link
                </label>
                <input
                  type="text"
                  value={roomOrLink}
                  onChange={(e) => setRoomOrLink(e.target.value)}
                  placeholder="e.g. Room 402B • Science Hall"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

    </>
  );
}
