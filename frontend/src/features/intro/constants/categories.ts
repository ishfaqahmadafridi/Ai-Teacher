import type { CategoryItem } from '../types/intro.types';

export const CATEGORIES: CategoryItem[] = [
  { label: 'Primary School', icon: '📚' },
  { label: 'Middle School', icon: '✏️' },
  { label: 'High School', icon: '🏫' },
  { label: 'College', icon: '🎓' },
  { label: 'University', icon: '🏛️' },
  { label: 'Engineering', icon: '⚙️' },
  { label: 'Medical', icon: '🩺' },
  { label: 'Computer Science', icon: '💻' },
  { label: 'Artificial Intelligence', icon: '🤖' },
  { label: 'Programming', icon: '< />' },
  { label: 'Business', icon: '💼' },
  { label: 'Economics', icon: '📈' },
  { label: 'Accounting', icon: '🧾' },
  { label: 'Law', icon: '⚖️' },
  { label: 'Languages', icon: '🌐' },
  { label: 'Arts', icon: '🎨' },
  { label: 'History', icon: '🏺' },
  { label: 'Geography', icon: '🗺️' },
  { label: 'Mathematics', icon: '∑' },
  { label: 'Physics', icon: '⚛️' },
  { label: 'Chemistry', icon: '🧪' },
  { label: 'Biology', icon: '🧬' },
  { label: 'Certifications', icon: '🏅' },
  { label: 'Exam Prep', icon: '📝' },
  { label: 'Career Development', icon: '🚀' },
  { label: 'Life-long Learning', icon: '♾️' },
];

// Split categories into three unique tracks for scrolling
export const TRACK_1 = CATEGORIES.slice(0, 9);
export const TRACK_2 = CATEGORIES.slice(9, 18);
export const TRACK_3 = CATEGORIES.slice(18);
