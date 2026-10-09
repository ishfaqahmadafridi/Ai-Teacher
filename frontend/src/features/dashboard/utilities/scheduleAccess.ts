import type { ScheduleItem } from '../types/schedule.types';

/** Weekly sessions use their saved timezone, with the profile timezone as fallback. */
export function getScheduleAccess(item: ScheduleItem, timezone: string, now = new Date()) {
  const zone = item.timezone || timezone;
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: zone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  }).formatToParts(now);
  const value = (type: string) => parts.find((part) => part.type === type)?.value || '';
  const parse = (text: string) => {
    const match = text.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
    if (!match) return NaN;
    let hour = Number(match[1]);
    const minute = Number(match[2]);
    if (minute > 59 || (match[3] ? hour < 1 || hour > 12 : hour > 23)) return NaN;
    if (match[3]) hour = hour % 12 + (match[3].toUpperCase() === 'PM' ? 12 : 0);
    return hour * 60 + minute;
  };
  const range = (item.timeSlot || item.timeFormatted).split(/\s*[-–]\s*/);
  const start = parse(item.startTime || range[0] || '');
  const end = parse(item.endTime || range[1] || '');
  const current = Number(value('hour')) * 60 + Number(value('minute')) + Number(value('second')) / 60;
  const sameDay = value('weekday') === item.dayOfWeek;
  const valid = Number.isFinite(start) && Number.isFinite(end) && start < end;
  const minutesUntilStart = sameDay && valid ? start - current : null;
  const canJoin = valid && sameDay && current >= start && current < end && item.status !== 'completed';
  return {
    canJoin,
    startsSoon: item.status !== 'completed' && minutesUntilStart !== null && minutesUntilStart > 0 && minutesUntilStart <= 5,
    minutesUntilStart,
    ended: Boolean(item.sessionEnded) || (sameDay && valid && current >= end),
    occurrenceKey: `${item.id}:${value('year')}-${value('month')}-${value('day')}`,
  };
}
