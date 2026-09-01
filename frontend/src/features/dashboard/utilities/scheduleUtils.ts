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

  const slots = slotsByPref[preferredTime] ?? slotsByPref.morning;
  const daysPattern: DayOfWeek[][] = [
    ['Monday', 'Wednesday', 'Friday'],
    ['Tuesday', 'Thursday', ...(includeSaturday ? ['Saturday' as DayOfWeek] : [])],
  ];

  const generatedItems: ScheduleItem[] = [];

  registeredCourses.forEach((courseTitle, courseIdx) => {
    const pattern = daysPattern[courseIdx % daysPattern.length];
    const slot = slots[courseIdx % slots.length];

    pattern.forEach((day) => {
      const currentDayCount = generatedItems.filter((i) => i.dayOfWeek === day).length;
      if (currentDayCount < maxClassesPerDay) {
        generatedItems.push({
          id: `ai-gen-${day.toLowerCase().slice(0, 3)}-${courseIdx + 1}`,
          title: `Live Lecture: ${courseTitle}`,
          subject: courseTitle,
          timeFormatted: slot,
          timeSlot: slot,
          dayOfWeek: day,
          instructorName: 'Dr. Sarah Jenkins',
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

