'use client';

import { Clock } from 'lucide-react';
import { useAuthStore } from '@/features/auth/state/authStore';
import { useScheduleClock } from '../../hooks/useScheduleClock';
import { getScheduleAccess } from '../../utilities/scheduleAccess';
import type { ScheduleItem } from '../../types/schedule.types';

export function ScheduleStartReminder({ items }: { items: ScheduleItem[] }) {
  const timezone = useAuthStore((state) => state.user?.timezone || '');
  const now = useScheduleClock();
  if (!now) return null;
  const upcoming = items.filter((item) => getScheduleAccess(item, timezone, new Date(now)).startsSoon);
  if (!upcoming.length) return null;
  return (
    <div role="alert" className="space-y-2 rounded-xl border border-sky-500/30 bg-sky-500/10 p-4 text-sm text-sky-100">
      {upcoming.map((item) => {
        const { minutesUntilStart } = getScheduleAccess(item, timezone, new Date(now));
        return (
          <p key={item.id} className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0" />
            <span><strong>{item.title}</strong> starts in {Math.ceil(minutesUntilStart!)} minutes. Join opens at the scheduled start time.</span>
          </p>
        );
      })}
    </div>
  );
}
