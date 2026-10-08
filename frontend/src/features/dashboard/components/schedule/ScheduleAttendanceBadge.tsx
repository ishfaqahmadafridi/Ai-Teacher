import { CircleCheck, CircleMinus, CircleX } from 'lucide-react';
import type { ScheduleItem } from '../../types/scheduleDomain.types';

const attendanceStyles = {
  attended: {
    label: 'Attended',
    icon: CircleCheck,
    className: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
    description: 'You joined this scheduled session.',
  },
  missed: {
    label: 'Missed',
    icon: CircleX,
    className: 'border-rose-400/25 bg-rose-400/10 text-rose-300',
    description: 'This session ended without a recorded join.',
  },
  unmarked: {
    label: 'No attendance record',
    icon: CircleMinus,
    className: 'border-slate-600/60 bg-slate-800/60 text-slate-400',
    description: 'Attendance tracking was not available for this session.',
  },
};

export function ScheduleAttendanceBadge({ item }: { item: ScheduleItem }) {
  if ((!item.attendance || item.attendance === 'unmarked') && !item.sessionEnded) return null;
  const { label, icon: Icon, className, description } = attendanceStyles[item.attendance || 'unmarked'];
  return (
    <span
      title={description}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold leading-5 ${className}`}
    >
      <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      {label}
    </span>
  );
}
