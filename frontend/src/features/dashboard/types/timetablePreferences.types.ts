export type PreferredTimeOfDay = 'morning' | 'afternoon' | 'evening' | 'any' | 'custom';

export type MaxClassesPerDay = 2 | 3 | 4;

export interface StudentSchedulePreferences {
  customStartTime?: string;
  customEndTime?: string;
  preferredTime: PreferredTimeOfDay;
  maxClassesPerDay: MaxClassesPerDay;
  includeSaturday: boolean;
  registeredCourses: string[];
}

export interface TimetablePreferencesModalProps {
  error?: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitPreferences: (preferences: StudentSchedulePreferences) => void;
  isLoading?: boolean;
}

export interface UseTimetablePreferencesModalOptions {
  onSubmitPreferences: (preferences: StudentSchedulePreferences) => void;
  initialPreferences?: Partial<StudentSchedulePreferences>;
}

export interface TimetablePreferencesModalHeaderProps {
  onClose: () => void;
  className?: string;
}

export interface TimetableTimePreferenceSelectorProps {
  preferredTime: PreferredTimeOfDay;
  onSelectTime: (time: PreferredTimeOfDay) => void;
  className?: string;
}

export interface TimetableMaxClassesSelectorProps {
  maxClassesPerDay: MaxClassesPerDay;
  onSelectMaxClasses: (count: MaxClassesPerDay) => void;
  className?: string;
}

export interface TimetableStudyDaysSelectorProps {
  includeSaturday: boolean;
  onSelectIncludeSaturday: (includeSaturday: boolean) => void;
  className?: string;
}

export interface TimetablePreferencesModalFooterProps {
  onClose: () => void;
  isLoading?: boolean;
  className?: string;
}
