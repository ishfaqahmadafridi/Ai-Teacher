import { formatScheduleItemTime } from '../../utilities/scheduleTimeFormat';
import { Clock, Calendar, User, MapPin } from 'lucide-react';
import type { ScheduleItem } from '../../types/scheduleDomain.types';

export function ScheduledClassNoticeDetails({ item }: { item: ScheduleItem }) {
  return (
    <div className="bg-[#0B132B] border border-[#1E293B] rounded-xl p-4 space-y-3">
      <div>
        <span className="text-[11px] font-semibold text-[#38BDF8] uppercase tracking-wide">
          {item.subject}
        </span>
        <h4 className="text-base font-bold text-white mt-0.5 leading-snug">
          {item.title}
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#1E293B]/80 text-xs">
        <div className="flex items-center gap-2 text-[#94A3B8]">
          <Calendar className="w-4 h-4 text-[#38BDF8] shrink-0" />
          <div>
            <span className="text-[10px] text-[#64748B] block uppercase font-bold">Schedule Day</span>
            <span className="text-white font-medium">{item.dayOfWeek}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[#94A3B8]">
          <Clock className="w-4 h-4 text-[#38BDF8] shrink-0" />
          <div>
            <span className="text-[10px] text-[#64748B] block uppercase font-bold">Time Slot</span>
            <span className="text-[#38BDF8] font-mono font-bold">{formatScheduleItemTime(item)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[#94A3B8]">
          <User className="w-4 h-4 text-[#38BDF8] shrink-0" />
          <div>
            <span className="text-[10px] text-[#64748B] block uppercase font-bold">Instructor</span>
            <span className="text-white font-medium">{item.instructorName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[#94A3B8]">
          <MapPin className="w-4 h-4 text-[#38BDF8] shrink-0" />
          <div>
            <span className="text-[10px] text-[#64748B] block uppercase font-bold">Room / Hall</span>
            <span className="text-white font-medium">{item.roomOrLink}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
