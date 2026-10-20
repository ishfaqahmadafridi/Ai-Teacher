import type { DayOfWeek, ScheduleItem } from '../types/schedule.types';
import { getScheduleTimeMinutes } from './scheduleTimeFormat';

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
  const slots = new Map<string, number>();
  for (const item of items) {
    const slot = item.timeSlot || item.timeFormatted;
    if (slot) slots.set(slot, getScheduleTimeMinutes(item.startTime || slot.split(/\s*[-–]\s*/)[0]) ?? Number.POSITIVE_INFINITY);
  }
  return [...slots.keys()].sort((left, right) => slots.get(left)! - slots.get(right)! || left.localeCompare(right));
}
