import { formatScheduleItemTime } from '../../utilities/scheduleTimeFormat';
import { Dialog } from '@base-ui/react/dialog';
import { AlertCircle } from 'lucide-react';
import type { ScheduleItem } from '../../types/scheduleDomain.types';
import type { getScheduleAccess } from '../../utilities/scheduleAccess';

interface ScheduledClassAccessNoticeProps {
  item: ScheduleItem;
  timezone: string;
  access: ReturnType<typeof getScheduleAccess>;
}

export function ScheduledClassAccessNotice({ item, timezone, access }: ScheduledClassAccessNoticeProps) {
  return (
    <div className="bg-[#2563EB]/10 border border-[#2563EB]/30 rounded-xl p-4 text-sm text-[#CBD5E1] flex items-start gap-3 leading-relaxed">
      <AlertCircle className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />
      <div>
        <p className="font-bold text-white">When you can join</p>
        <Dialog.Description className="mt-1 text-slate-300">
          {access.startsSoon
            ? `Your class starts in ${Math.ceil(access.minutesUntilStart!)} minutes. `
            : access.ended || item.status === 'completed'
              ? 'This session has ended. '
              : 'This class is outside its scheduled time. '}
          Join is available from the scheduled start until the end of class.
          Your session is on <strong>{item.dayOfWeek}</strong> at <strong>{formatScheduleItemTime(item)}</strong>
          {(item.timezone || timezone) && <> ({item.timezone || timezone})</>}.

        </Dialog.Description>
      </div>
    </div>
  );
}
