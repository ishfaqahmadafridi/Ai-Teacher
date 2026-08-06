export interface StatItem {
  number: string;
  label: string;
  stars?: number;
}

export const STATS_DATA: StatItem[] = [
  {
    number: '500K+',
    label: 'Students Globally',
  },
  {
    number: '150+',
    label: 'Expert AI Tutors',
  },
  {
    number: '4.9/5',
    label: 'Rating',
    stars: 5,
  },
];
