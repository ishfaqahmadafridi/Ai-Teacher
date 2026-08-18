import type { AcademicYear } from './onboarding.types';

export interface YearOption {
  id: AcademicYear;
  title: string;
  subtitle: string;
  badge?: string;
}

export const primaryYears: YearOption[] = [
  { id: 'freshman', title: 'Grade 1-2', subtitle: 'Early Primary - Foundational Literacy' },
  { id: 'sophomore', title: 'Grade 3-4', subtitle: 'Upper Primary - Core Skills & Curiosity' },
  { id: 'junior', title: 'Grade 5', subtitle: 'Elementary Exit - Prep for Middle School' },
];

export const middleYears: YearOption[] = [
  { id: 'freshman', title: 'Grade 6', subtitle: '6th Grade - Middle School Transition' },
  { id: 'sophomore', title: 'Grade 7', subtitle: '7th Grade - Intermediate Exploration' },
  { id: 'junior', title: 'Grade 8', subtitle: '8th Grade - High School & STEM Prep' },
];

export const highSchoolYears: YearOption[] = [
  { id: 'freshman', title: 'Grade 9', subtitle: 'Freshman Year - Core Foundations' },
  { id: 'sophomore', title: 'Grade 10', subtitle: 'Sophomore Year - Skill Expansion' },
  { id: 'junior', title: 'Grade 11', subtitle: 'Junior Year - Honors & AP Prep' },
  { id: 'senior', title: 'Grade 12', subtitle: 'Senior Year - College Prep Phase' },
];

export const universityYears: YearOption[] = [
  { id: 'freshman', title: 'Year 1', subtitle: 'Freshman - General Education' },
  { id: 'sophomore', title: 'Year 2', subtitle: 'Sophomore - Major Selection' },
  { id: 'junior', title: 'Year 3', subtitle: 'Junior - Advanced Specialization' },
  { id: 'senior', title: 'Year 4', subtitle: 'Senior - Capstone & Research' },
  { id: 'graduate', title: 'Graduate', subtitle: 'Master / PhD Candidate' },
];

export const postgraduateYears: YearOption[] = [
  { id: 'freshman', title: "Master's Yr 1", subtitle: 'Graduate Coursework & Labs' },
  { id: 'sophomore', title: "Master's Yr 2", subtitle: 'Thesis & Applied Research' },
  { id: 'junior', title: 'PhD Candidate', subtitle: 'Doctoral Dissertation' },
  { id: 'graduate', title: 'Postdoc Research', subtitle: 'Independent Science Leader' },
];

export const professionalYears: YearOption[] = [
  { id: 'freshman', title: 'Upskilling', subtitle: 'Core Tech & Industry Certification' },
  { id: 'sophomore', title: 'Career Switch', subtitle: 'Intensive Transition Portfolio' },
  { id: 'junior', title: 'Executive', subtitle: 'AI Leadership & Management' },
];

export const selfLearnerYears: YearOption[] = [
  { id: 'freshman', title: 'Exploratory', subtitle: 'Curiosity-Driven Discovery' },
  { id: 'sophomore', title: 'Deep Dive', subtitle: 'Self-Paced Project Building' },
  { id: 'junior', title: 'Mastery', subtitle: 'Advanced Independent Study' },
];
