import type { AcademicYear } from './onboarding.types';

export interface YearOption {
  id: AcademicYear;
  title: string;
  subtitle: string;
  badge?: string;
}

export const highSchoolYears: YearOption[] = [
  { id: 'freshman', title: 'Grade 9', subtitle: 'Freshman Year - Core Foundations' },
  { id: 'sophomore', title: 'Grade 10', subtitle: 'Sophomore Year - Skill Expansion' },
  { id: 'junior', title: 'Grade 11', subtitle: 'Junior Year - Honors & AP Prep' },
  { id: 'senior', title: 'Grade 12', subtitle: 'Senior Year - College Application Phase' },
];

export const universityYears: YearOption[] = [
  { id: 'freshman', title: 'Year 1', subtitle: 'Freshman - General Education' },
  { id: 'sophomore', title: 'Year 2', subtitle: 'Sophomore - Major Selection' },
  { id: 'junior', title: 'Year 3', subtitle: 'Junior - Advanced Specialization' },
  { id: 'senior', title: 'Year 4', subtitle: 'Senior - Capstone & Research' },
  { id: 'graduate', title: 'Graduate', subtitle: 'Master / PhD Candidate' },
];
