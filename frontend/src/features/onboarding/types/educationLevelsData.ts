import type { EducationLevel } from './onboarding.types';

export interface LevelOption {
  id: EducationLevel;
  title: string;
  description: string;
  icon: string;
  span?: string;
}

export const educationLevels: LevelOption[] = [
  {
    id: 'primary',
    title: 'Primary',
    description: 'Early education foundations',
    icon: '👶',
  },
  {
    id: 'middle',
    title: 'Middle',
    description: 'Core academic development',
    icon: '🏫',
  },
  {
    id: 'high_school',
    title: 'High School',
    description: 'University preparation phase',
    icon: '📖',
  },
  {
    id: 'undergraduate',
    title: 'College',
    description: 'Undergraduate specialization',
    icon: '🏛️',
  },
  {
    id: 'postgraduate',
    title: 'University',
    description: 'Master & Doctoral research',
    icon: '🎓',
  },
  {
    id: 'professional',
    title: 'Professional',
    description: 'Career growth & upskilling',
    icon: '💼',
  },
  {
    id: 'self_learner',
    title: 'Lifelong Learner',
    description: 'Continuous exploration & interest-based learning',
    icon: '♾️',
    span: 'lg:col-span-2',
  },
];
