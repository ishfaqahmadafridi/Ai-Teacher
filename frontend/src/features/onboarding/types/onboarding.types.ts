import type { ReactNode } from 'react';
import type { LevelOption } from './educationLevelsData';
import type { YearOption } from './academicYearData';
import type { SubjectItem, SubjectCategory } from './interestsData';
import type { CountryOption } from '../constants/countryConstants';

export type EducationLevel =
  | 'primary'
  | 'middle'
  | 'high_school'
  | 'undergraduate'
  | 'postgraduate'
  | 'professional'
  | 'self_learner';

export type AcademicYear = 'freshman' | 'sophomore' | 'junior' | 'senior' | 'graduate';

export interface StudentProfileData {
  fullName: string;
  dob: string;
  country: string;
  timezone: string;
  language?: string;
  avatarUrl?: string;
}

export interface OnboardingState {
  currentStep: number;
  profile: StudentProfileData;
  educationLevel: EducationLevel | null;
  academicYear: AcademicYear | null;
  selectedInterests: string[];
  isLoading: boolean;
  error: string | null;
}

export interface StepProgressHeaderProps {
  step: number;
  totalSteps: number;
  percentage: number;
  title?: string;
  className?: string;
}

export interface EducationOptionCardProps {
  option: LevelOption;
  selectedLevel: EducationLevel | null;
  onSelect: (id: EducationLevel) => void;
}

export interface AcademicYearOptionCardProps {
  year: YearOption;
  selectedYear: AcademicYear | null;
  onSelect: (id: AcademicYear) => void;
}

export interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export interface CountrySearchInputProps {
  query: string;
  isOpen: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleOpen: () => void;
}

export interface CountryDropdownMenuProps {
  isOpen: boolean;
  query: string;
  filteredCountries: CountryOption[];
  onSelectCountry: (country: CountryOption) => void;
}

export interface ProfileFormFieldsProps {
  profile: StudentProfileData;
  onChange: (field: keyof StudentProfileData, value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export interface FullNameInputProps {
  value: string;
  onChange: (value: string) => void;
}

export interface DobInputProps {
  value: string;
  onChange: (value: string) => void;
}

export interface TimezoneSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export interface LanguageSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export interface ProfileFormActionsProps {
  onBack: () => void;
  onSubmit: () => void;
  isSubmitDisabled?: boolean;
}

export interface AIMentorBannerCardProps {
  className?: string;
}

export interface Step3ProfileLayoutProps {
  children: ReactNode;
}

export interface ProfileFormContainerProps {
  children?: ReactNode;
}

export interface Step4EducationLayoutProps {
  children: ReactNode;
}

export interface EducationProgressHeaderProps {
  className?: string;
}

export interface EducationLevelsGridProps {
  selectedLevel: EducationLevel | null;
  onSelectLevel: (level: EducationLevel) => void;
}

export interface Step5AcademicLayoutProps {
  children: ReactNode;
}

export interface AcademicProgressHeaderProps {
  className?: string;
}

export type AcademicYearMode = 'high_school' | 'university' | 'professional' | 'self_learner';

export type UniversityDegreeTrack = 'undergraduate' | 'masters' | 'doctorate' | 'postdoc';

export type AcademicSemester = 'sem_1' | 'sem_2' | 'sem_3';

export interface AcademicLevelToggleProps {
  levelMode: AcademicYearMode;
  onToggleLevel: (mode: AcademicYearMode) => void;
}

export interface AcademicYearGridProps {
  years: YearOption[];
  selectedYear: AcademicYear | null;
  onSelectYear: (year: AcademicYear) => void;
}

export interface UniversityDegreeSelectorProps {
  selectedTrack: UniversityDegreeTrack;
  onSelectTrack: (track: UniversityDegreeTrack) => void;
  className?: string;
}

export interface SemesterYearSelectorProps {
  selectedYear: AcademicYear | null;
  onSelectYear: (year: AcademicYear) => void;
  selectedSemester: AcademicSemester;
  onSelectSemester: (semester: AcademicSemester) => void;
  className?: string;
}

export interface Step6InterestsLayoutProps {
  children: ReactNode;
  mobileBar?: ReactNode;
}

export interface InterestsHeaderProps {
  className?: string;
}

export interface InterestsProgressHeaderProps {
  className?: string;
}

export interface InterestsSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddCustom: (subject: string) => void;
}

export interface CategorizedSubjectsSectionProps {
  categories: SubjectCategory[];
  searchQuery: string;
  selectedInterests: string[];
  onToggleInterest: (name: string) => void;
}

export interface CustomSubjectCardProps {
  customInput: string;
  onCustomInputChange: (value: string) => void;
  onAddCustom: (subject: string) => void;
  customSuggestions: string[];
  selectedInterests: string[];
  onToggleInterest: (name: string) => void;
}

export interface MobileSummaryBarProps {
  selectedCount: number;
  onSubmit: () => void;
}

export interface LearningSummarySidebarProps {
  selectedInterests: string[];
  onToggleInterest: (name: string) => void;
  onSubmit: () => void;
  className?: string;
}

export interface UseLearningSummarySidebarOptions {
  selectedInterests: string[];
}

export interface SidebarHeaderProps {
  title: string;
  studyMode: 'timetable' | 'self_paced';
}

export interface StudyModeToggleProps {
  studyMode: 'timetable' | 'self_paced';
  modeDescription: string;
  onToggleStudyMode: (mode: 'timetable' | 'self_paced') => void;
}

export interface SelectedFieldsListProps {
  selectedInterests: string[];
  onToggleInterest: (name: string) => void;
}

export interface PaceDurationToggleProps {
  paceMode: '4_months' | '2_months';
  onTogglePaceMode: (mode: '4_months' | '2_months') => void;
}

export interface SidebarActionBtnProps {
  isDisabled: boolean;
  onSubmit: () => void;
}

export interface OnboardingProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

export interface OnboardingHeaderProps {
  className?: string;
  logoHref?: string;
  showNav?: boolean;
  showAction?: boolean;
}
