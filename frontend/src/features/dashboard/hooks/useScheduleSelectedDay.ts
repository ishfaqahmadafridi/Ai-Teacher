'use client';

import { useState } from 'react';
import { useScheduleClock } from './useScheduleClock';
import type { DayOfWeek } from '../types/scheduleDomain.types';

export function useScheduleSelectedDay(timezone: string, defaultDay?: DayOfWeek) {
  const now = useScheduleClock();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date(now));
  const today = parts.find((part) => part.type === 'weekday')!.value as DayOfWeek;
  const date = parts.filter((part) => ['year', 'month', 'day'].includes(part.type)).map((part) => part.value).join('-');
  const [selection, setSelection] = useState<{ day: DayOfWeek; date: string } | null>(null);
  return {
    selectedDay: selection?.date === date ? selection.day : defaultDay || today,
    setSelectedDay: (day: DayOfWeek) => setSelection({ day, date }),
  };
}
