import type { ScheduleItem, DayOfWeek } from './scheduleDomain.types';
export interface StudyPlanPeriodFieldsProps {
  description?: string;
  disabled?: boolean;
  startDate: string;
  durationMonths: number;
  onStartDateChange: (date: string) => void;
  onDurationChange: (months: number) => void;
}
export interface StudyPlanWeek { number: number; start: string; end: string; items: ScheduleItem[]; goals: string[] }
export interface StudyPlanWeeksProps {
  items: ScheduleItem[];
  onJoinClass?: (id: string) => void;
  onSelectNoticeItem?: (item: ScheduleItem) => void;
}

export interface StudyPlanDaysProps { label?: string; days: DayOfWeek[]; onToggle: (day: DayOfWeek) => void }
