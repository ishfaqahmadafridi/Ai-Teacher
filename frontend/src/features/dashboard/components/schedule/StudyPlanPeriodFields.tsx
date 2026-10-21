'use client';
import { memo } from 'react';
import { STUDY_PLAN_DURATIONS } from '../../constants/studyPlanConstants';
import type { StudyPlanPeriodFieldsProps } from '../../types/studyPlan.types';
export const StudyPlanPeriodFields = memo(function StudyPlanPeriodFields({ disabled = false, description, startDate, durationMonths, onStartDateChange, onDurationChange }: StudyPlanPeriodFieldsProps) {
  return <fieldset disabled={disabled} className="grid gap-3 sm:grid-cols-2">
    <legend className="mb-3 text-sm font-semibold">Study period</legend>
    <label className="text-xs font-medium">Start date<input type="date" required value={startDate} onChange={event => onStartDateChange(event.target.value)} className="mt-2 w-full rounded-lg border border-dashboard-border bg-dashboard-panel p-3 text-sm" /></label>
    <label className="text-xs font-medium">Duration<select value={durationMonths} onChange={event => onDurationChange(Number(event.target.value))} className="mt-2 w-full rounded-lg border border-dashboard-border bg-dashboard-panel p-3 text-sm">{STUDY_PLAN_DURATIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
    <p className="text-xs leading-5 text-dashboard-muted sm:col-span-2">{description ?? 'Save an outline for each course first. Topics and exercises progress across this period; your study hours set the maximum availability.'}</p>
  </fieldset>;
});
StudyPlanPeriodFields.displayName = 'StudyPlanPeriodFields';
