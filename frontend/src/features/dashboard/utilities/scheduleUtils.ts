import type { DayOfWeek, ScheduleItem } from '../types/schedule.types';

export function filterScheduleItemsByDay(
  items: ScheduleItem[],
  day: DayOfWeek
): ScheduleItem[] {
  return items.filter((item) => item.dayOfWeek === day);
}

export function findScheduleItemBySlotAndDay(
  items: ScheduleItem[],
  slot: string,
  day: DayOfWeek
): ScheduleItem | undefined {
  return items.find(
    (item) => item.dayOfWeek === day && (item.timeSlot === slot || item.timeFormatted === slot)
  );
}

export function hasLiveSessionOnDay(items: ScheduleItem[], day: DayOfWeek): boolean {
  return items.some((item) => item.dayOfWeek === day && item.status === 'live');
}

/** Build matrix rows from persisted sessions, including custom study hours. */
export function getScheduleTimeSlots(items: ScheduleItem[]): string[] {
  const slots = new Map<string, string>();
  for (const item of items) {
    const slot = item.timeSlot || item.timeFormatted;
    if (slot) slots.set(slot, item.startTime || slot);
  }
  return [...slots.keys()].sort((left, right) => slots.get(left)!.localeCompare(slots.get(right)!));
}
