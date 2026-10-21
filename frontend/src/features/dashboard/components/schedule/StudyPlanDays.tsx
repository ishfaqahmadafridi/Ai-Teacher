'use client';
import { memo } from 'react';
import { DAYS_OF_WEEK } from '../../constants/scheduleConstants';
import type { StudyPlanDaysProps } from '../../types/studyPlan.types';
export const StudyPlanDays = memo(function StudyPlanDays({ label = 'Study days', days, onToggle }: StudyPlanDaysProps) {
  return <fieldset><legend className="mb-3 text-sm font-semibold">{label}</legend><div className="flex flex-wrap gap-2">{DAYS_OF_WEEK.map(day => <label key={day} className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashboard-border px-3 py-2 text-xs"><input type="checkbox" checked={days.includes(day)} onChange={() => onToggle(day)} />{day}</label>)}</div></fieldset>;
});
StudyPlanDays.displayName = 'StudyPlanDays';
