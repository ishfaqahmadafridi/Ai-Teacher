import type { DayOfWeek, ScheduleItem, StudentSchedulePreferences, SuggestedTimetable } from '../types/schedule.types';

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

export function generateSuggestedTimetable(
  preferences: StudentSchedulePreferences
): SuggestedTimetable {
  const { preferredTime, maxClassesPerDay, includeSaturday, registeredCourses } = preferences;

  const slotsByPref: Record<string, string[]> = {
    morning: ['09:00 AM - 10:30 AM', '11:00 AM - 12:30 PM'],
    afternoon: ['02:00 PM - 03:30 PM', '04:00 PM - 05:30 PM'],
    evening: ['04:00 PM - 05:30 PM', '06:00 PM - 07:30 PM'],
    any: ['09:00 AM - 10:30 AM', '11:00 AM - 12:30 PM', '02:00 PM - 03:30 PM'],
  };

  let slots = slotsByPref[preferredTime] ?? slotsByPref.morning;
  if (preferredTime === 'custom') {
    const parse = (time: string | undefined) => {
      if (!time || !/^\d{2}:\d{2}$/.test(time)) return NaN;
      const [hour, minute] = time.split(':').map(Number);
      return hour < 24 && minute < 60 ? hour * 60 + minute : NaN;
    };
    const start = parse(preferences.customStartTime);
    const end = parse(preferences.customEndTime);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end - start < 90) {
      throw new Error('Custom study hours must allow at least one 90-minute class on the same day.');
    }
    const format = (minutes: number) => `${String(Math.floor(minutes / 60) % 12 || 12).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')} ${minutes < 720 ? 'AM' : 'PM'}`;
    slots = [];
    for (let time = start; time + 90 <= end; time += 120) slots.push(`${format(time)} - ${format(time + 90)}`);
  }
  const daysPattern: DayOfWeek[][] = [
    ['Monday', 'Wednesday', 'Friday'],
    ['Tuesday', 'Thursday', ...(includeSaturday ? ['Saturday' as DayOfWeek] : [])],
  ];

  const generatedItems: ScheduleItem[] = [];

  registeredCourses.forEach((courseTitle, courseIdx) => {
    const pattern = daysPattern[courseIdx % daysPattern.length];

    pattern.forEach((day) => {
      const currentDayCount = generatedItems.filter((i) => i.dayOfWeek === day).length;
      const usedSlots = new Set(generatedItems.filter((i) => i.dayOfWeek === day).map((i) => i.timeSlot));
      const slot = slots.find((candidate) => !usedSlots.has(candidate));
      if (currentDayCount < maxClassesPerDay && slot) {
        generatedItems.push({
          id: `ai-gen-${day.toLowerCase().slice(0, 3)}-${courseIdx + 1}`,
          title: `Live Lecture: ${courseTitle}`,
          subject: courseTitle,
          timeFormatted: slot,
          timeSlot: slot,
          dayOfWeek: day,
          instructorName: 'AI Teacher',
          roomOrLink: 'Virtual Classroom #101',
          status: 'upcoming',
        });
      }
    });
  });

  return {
    className: registeredCourses[0] ?? 'Registered Term Courses',
    schedule: generatedItems,
    totalWeeklyClasses: generatedItems.length,
    optimizationSummary: `AI planner scheduled ${generatedItems.length} classes across the week matching your ${preferredTime} preference.`,
  };
}
