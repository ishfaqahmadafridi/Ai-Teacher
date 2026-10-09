import type { ScheduleItem } from '../types/scheduleDomain.types';

const clock = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC',
});

/** Format wall-clock values without converting the timetable's timezone. */
export function formatScheduleTime(value: string): string {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!match) return value;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  if (minute > 59 || (match[3] ? hour < 1 || hour > 12 : hour > 23)) return value;
  if (match[3]) hour = hour % 12 + (match[3].toUpperCase() === 'PM' ? 12 : 0);
  return clock.format(new Date(Date.UTC(2000, 0, 1, hour, minute)));
}

export function formatScheduleTimeSlot(slot: string): string {
  const parts = slot.split(/\s*[-–]\s*/);
  return parts.length === 2 ? parts.map(formatScheduleTime).join(' – ') : slot;
}

export function formatScheduleItemTime(item: ScheduleItem): string {
  return item.startTime && item.endTime
    ? `${formatScheduleTime(item.startTime)} – ${formatScheduleTime(item.endTime)}`
    : formatScheduleTimeSlot(item.timeSlot || item.timeFormatted);
}
