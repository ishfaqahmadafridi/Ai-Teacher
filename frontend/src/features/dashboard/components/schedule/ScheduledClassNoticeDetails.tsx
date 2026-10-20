import { formatScheduleItemTime } from '../../utilities/scheduleTimeFormat';
import { Clock, Calendar, User, MapPin } from 'lucide-react';
import type { ScheduleItem } from '../../types/scheduleDomain.types';

export function ScheduledClassNoticeDetails({ item }: { item: ScheduleItem }) {
  return (
    <div className="bg-dashboard-bg border border-dashboard-border rounded-xl p-4 space-y-3">
      <div>
        <span className="text-[11px] font-semibold text-dashboard-primary uppercase tracking-wide">
          {item.subject}
        </span>
        <h4 className="text-base font-semibold text-dashboard-text mt-0.5 leading-snug">
          {item.title}
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-dashboard-border/80 text-xs">
        <div className="flex items-center gap-2 text-dashboard-muted">
          <Calendar className="w-4 h-4 text-dashboard-primary shrink-0" />
          <div>
            <span className="text-[10px] text-dashboard-muted block uppercase font-bold">Schedule Day</span>
            <span className="text-dashboard-text font-medium">{item.dayOfWeek}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-dashboard-muted">
          <Clock className="w-4 h-4 text-dashboard-primary shrink-0" />
          <div>
            <span className="text-[10px] text-dashboard-muted block uppercase font-bold">Time Slot</span>
            <span className="text-dashboard-text font-medium tabular-nums">{formatScheduleItemTime(item)}</span>
          </div>
        </div>

        {item.instructorName?.trim() && <div className="flex items-center gap-2 text-dashboard-muted">
          <User className="w-4 h-4 text-dashboard-primary shrink-0" />
          <div>
            <span className="text-[10px] text-dashboard-muted block uppercase font-bold">Instructor</span>
            <span className="text-dashboard-text font-medium">{item.instructorName}</span>
          </div>
        </div>}

        {item.roomOrLink?.trim() && <div className="flex items-center gap-2 text-dashboard-muted">
          <MapPin className="w-4 h-4 text-dashboard-primary shrink-0" />
          <div>
            <span className="text-[10px] text-dashboard-muted block uppercase font-bold">Room / Hall</span>
            <span className="break-all text-dashboard-text font-medium">{item.roomOrLink}</span>
          </div>
        </div>}
      </div>
    </div>
  );
}
