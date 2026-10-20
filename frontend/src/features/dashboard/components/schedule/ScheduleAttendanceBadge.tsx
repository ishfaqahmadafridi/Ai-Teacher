import { CircleCheck, CircleMinus, CircleAlert } from 'lucide-react';
import type { ScheduleItem } from '../../types/scheduleDomain.types';

const attendanceStyles = {
  attended: {
    label: 'Attended',
    icon: CircleCheck,
    className: 'border-dashboard-success/20 bg-dashboard-success/5 text-dashboard-success',
    description: 'You joined this scheduled session.',
  },
  missed: {
    label: 'Missed',
    icon: CircleAlert,
    className: 'border-dashboard-warning/20 bg-dashboard-warning/5 text-dashboard-warning',
    description: 'This session ended without a recorded join.',
  },
  unmarked: {
    label: 'Not recorded',
    icon: CircleMinus,
    className: 'border-transparent bg-dashboard-subtle text-dashboard-muted',
    description: 'Attendance tracking was not available for this session.',
  },
};

export function ScheduleAttendanceBadge({ item }: { item: ScheduleItem }) {
  if ((!item.attendance || item.attendance === 'unmarked') && !item.sessionEnded) return null;
  const { label, icon: Icon, className, description } = attendanceStyles[item.attendance || 'unmarked'];
  return (
    <span
      title={description}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-medium leading-5 ${className}`}
    >
      <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
      {label}
    </span>
  );
}
