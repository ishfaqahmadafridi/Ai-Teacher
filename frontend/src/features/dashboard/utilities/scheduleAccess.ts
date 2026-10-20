import type { ScheduleItem } from '../types/schedule.types';
import { DAYS_OF_WEEK } from '../constants/scheduleConstants';
import { JOIN_EARLY_MINUTES, JOIN_LATE_MINUTES } from '../constants/scheduleAccessConstants';
import { getScheduleTimeMinutes, formatScheduleMinutes } from './scheduleTimeFormat';

/** Evaluate the saved occurrence in its timezone, including early admission across midnight. */
export function getScheduleAccess(item: ScheduleItem, timezone: string, now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: item.timezone || timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  }).formatToParts(now);
  const value = (type: string) => parts.find((part) => part.type === type)?.value || '';
  const range = (item.timeSlot || item.timeFormatted).split(/\s*[-–]\s*/);
  const start = getScheduleTimeMinutes(item.startTime || range[0] || '');
  const end = getScheduleTimeMinutes(item.endTime || range[1] || '');
  const valid = start !== null && end !== null && start < end;
  const today = Date.UTC(Number(value('year')), Number(value('month')) - 1, Number(value('day'))) / 60000;
  const current = today + Number(value('hour')) * 60 + Number(value('minute')) + Number(value('second')) / 60 + now.getMilliseconds() / 60000;
  const dayOffset = DAYS_OF_WEEK.indexOf(item.dayOfWeek) - DAYS_OF_WEEK.findIndex((day) => day === value('weekday'));
  const savedDate = item.sessionDate ? Date.parse(`${item.sessionDate}T00:00:00Z`) / 60000 : NaN;
  let sessionDay = Number.isFinite(savedDate) ? savedDate : today + dayOffset * 1440;
  if (!Number.isFinite(savedDate) && valid && current >= sessionDay + start! + 7 * 1440 - JOIN_EARLY_MINUTES) sessionDay += 7 * 1440;
  const startAt = sessionDay + (start ?? 0);
  const endAt = sessionDay + (end ?? 0);
  const closesAt = Math.min(startAt + JOIN_LATE_MINUTES, endAt);
  const ended = Boolean(item.sessionEnded) || item.status === 'completed' || (valid && current >= endAt);
  const canJoin = valid && !ended && current >= startAt - JOIN_EARLY_MINUTES && current <= closesAt;
  const isLate = valid && !ended && current > closesAt;
  const minutesUntilStart = valid ? startAt - current : null;
  return {
    canJoin,
    isLate,
    inSession: valid && !ended && current >= startAt && current < endAt,
    startsSoon: canJoin && minutesUntilStart !== null && minutesUntilStart > 0,
    minutesUntilStart,
    ended,
    joinOpensAt: valid ? formatScheduleMinutes(start! - JOIN_EARLY_MINUTES) : '',
    joinClosesAt: valid ? formatScheduleMinutes(Math.min(start! + JOIN_LATE_MINUTES, end!)) : '',
    occurrenceKey: `${item.id}:${value('year')}-${value('month')}-${value('day')}`,
  };
}
