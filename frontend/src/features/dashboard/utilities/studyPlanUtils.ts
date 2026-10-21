import { DAYS_PER_STUDY_WEEK } from '../constants/studyPlanConstants';
import type { ScheduleItem } from '../types/scheduleDomain.types';
import type { StudyPlanWeek } from '../types/studyPlan.types';

export function studyPlanToday(timezone?: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: timezone || 'UTC', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const value = (name: string) => parts.find(part => part.type === name)?.value ?? '';
  return `${value('year')}-${value('month')}-${value('day')}`;
}

export function groupStudyPlanWeeks(items: ScheduleItem[]): StudyPlanWeek[] {
  const dated = items.filter(item => item.planStartDate && item.planEndDate && item.weekNumber);
  if (!dated.length) return [];
  const start = new Date(`${dated.map(item => item.planStartDate!).sort()[0]}T00:00:00Z`);
  const end = new Date(`${dated.map(item => item.planEndDate!).sort().at(-1)}T00:00:00Z`);
  const weeks: StudyPlanWeek[] = [];
  for (let index = 0; ; index++) {
    const from = new Date(start); from.setUTCDate(start.getUTCDate() + index * DAYS_PER_STUDY_WEEK);
    if (from > end) break;
    const to = new Date(from); to.setUTCDate(from.getUTCDate() + DAYS_PER_STUDY_WEEK - 1);
    const weekItems = dated.filter(item => item.sessionDate && item.sessionDate >= from.toISOString().slice(0, 10) && item.sessionDate <= (to > end ? end : to).toISOString().slice(0, 10)).sort((a, b) => `${a.sessionDate} ${a.startTime}`.localeCompare(`${b.sessionDate} ${b.startTime}`));
    weeks.push({ number: index + 1, start: from.toISOString().slice(0, 10), end: (to > end ? end : to).toISOString().slice(0, 10), items: weekItems,
      goals: [...new Set(weekItems.map(item => `${item.subject}: ${item.title}`))] });
  }
  return weeks;
}
