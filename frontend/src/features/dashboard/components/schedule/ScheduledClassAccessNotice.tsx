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
    <div className="bg-dashboard-selected/50 border border-dashboard-primary/15 rounded-xl p-4 text-sm text-dashboard-muted flex items-start gap-3 leading-relaxed">
      <AlertCircle className="w-5 h-5 text-dashboard-primary shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-dashboard-text">{access.isLate ? 'The joining window has closed' : 'When you can join'}</p>
        <Dialog.Description className="mt-1 text-xs leading-6 text-dashboard-muted">
          {access.isLate
            ? 'Sorry, you’re late. Entry closes 10 minutes after the class starts. '
            : access.ended || item.status === 'completed'
              ? 'This session has ended. '
              : access.startsSoon
                ? `Your class starts in ${Math.ceil(access.minutesUntilStart!)} minutes. You can join now. `
                : access.canJoin ? 'You can join this class now. ' : 'This class is not open for joining yet. '}
          Join is available from <strong>{access.joinOpensAt}</strong> through <strong>{access.joinClosesAt}</strong>.{' '}
          Your session is on <strong>{item.dayOfWeek}</strong> at <strong>{formatScheduleItemTime(item)}</strong>
          {(item.timezone || timezone) && <> ({item.timezone || timezone})</>}.

        </Dialog.Description>
      </div>
    </div>
  );
}
