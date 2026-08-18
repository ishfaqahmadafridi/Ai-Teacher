import type { AcademicYear, UniversityDegreeTrack, AcademicSemester } from './onboarding.types';

export interface YearOption {
  id: AcademicYear;
  title: string;
  subtitle: string;
  badge?: string;
}

export interface DegreeTrackOption {
  id: UniversityDegreeTrack;
  title: string;
  subtitle: string;
  badge: string;
  icon: string;
}

export interface SemesterOption {
  id: AcademicSemester;
  label: string;
  desc: string;
}

export const universityDegreeTracks: DegreeTrackOption[] = [
  {
    id: 'undergraduate',
    title: 'Undergraduate',
    subtitle: 'BS / BA / BTech Degree Program',
    badge: "Bachelor's",
    icon: '🏛️',
  },
  {
    id: 'masters',
    title: 'Master’s / MPhil',
    subtitle: 'MS / MA / MPhil Graduate Degree',
    badge: "Master's",
    icon: '🎓',
  },
  {
    id: 'doctorate',
    title: 'Doctorate (PhD)',
    subtitle: 'PhD Candidate & Dissertation Research',
    badge: 'Doctoral',
    icon: '🔬',
  },
  {
    id: 'postdoc',
    title: 'Postdoctoral Research',
    subtitle: 'Postdoc Fellow & Advanced Laboratory Lead',
    badge: 'Postdoc',
    icon: '⚡',
  },
];

export const semesterOptions: SemesterOption[] = [
  { id: 'sem_1', label: 'Semester 1 (Fall)', desc: 'August — December Term' },
  { id: 'sem_2', label: 'Semester 2 (Spring)', desc: 'January — May Term' },
  { id: 'sem_3', label: 'Summer / Trimester', desc: 'Accelerated Term' },
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
