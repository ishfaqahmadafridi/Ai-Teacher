import type { CategoryItem } from '../types/intro.types';

export const CATEGORIES: CategoryItem[] = [
  { id: 'primary', label: 'Primary School', icon: '📚', gradient: 'from-blue-500/20 to-cyan-500/20' },
  { id: 'middle', label: 'Middle School', icon: '✏️', gradient: 'from-indigo-500/20 to-purple-500/20' },
  { id: 'high', label: 'High School', icon: '🏫', gradient: 'from-cyan-500/20 to-teal-500/20' },
  { id: 'college', label: 'College', icon: '🎓', gradient: 'from-purple-500/20 to-pink-500/20' },
  { id: 'university', label: 'University', icon: '🏛️', gradient: 'from-blue-600/20 to-violet-600/20' },
  { id: 'engineering', label: 'Engineering', icon: '⚙️', gradient: 'from-amber-500/20 to-orange-500/20' },
  { id: 'medical', label: 'Medical & Healthcare', icon: '🩺', gradient: 'from-emerald-500/20 to-teal-500/20' },
  { id: 'cs', label: 'Computer Science', icon: '💻', gradient: 'from-cyan-400/20 to-blue-600/20' },
  { id: 'ai', label: 'Artificial Intelligence', icon: '🤖', gradient: 'from-violet-500/20 to-fuchsia-500/20' },
  { id: 'programming', label: 'Software Development', icon: '⚡', gradient: 'from-blue-500/20 to-indigo-500/20' },
  { id: 'business', label: 'Business Administration', icon: '💼', gradient: 'from-slate-500/20 to-zinc-500/20' },
  { id: 'economics', label: 'Economics & Finance', icon: '📈', gradient: 'from-green-500/20 to-emerald-500/20' },
  { id: 'accounting', label: 'Financial Accounting', icon: '🧾', gradient: 'from-teal-500/20 to-cyan-500/20' },
  { id: 'law', label: 'Legal Studies', icon: '⚖️', gradient: 'from-purple-600/20 to-indigo-600/20' },
  { id: 'languages', label: 'World Languages', icon: '🌐', gradient: 'from-blue-400/20 to-cyan-400/20' },
  { id: 'arts', label: 'Fine Arts & Design', icon: '🎨', gradient: 'from-rose-500/20 to-pink-500/20' },
  { id: 'history', label: 'World History', icon: '🏺', gradient: 'from-amber-600/20 to-yellow-600/20' },
  { id: 'geography', label: 'Earth & Geography', icon: '🗺️', gradient: 'from-emerald-600/20 to-green-600/20' },
  { id: 'mathematics', label: 'Mathematics & Calculus', icon: '∑', gradient: 'from-cyan-500/20 to-blue-500/20' },
  { id: 'physics', label: 'Physics & Mechanics', icon: '⚛️', gradient: 'from-indigo-500/20 to-cyan-500/20' },
  { id: 'chemistry', label: 'Chemistry & Molecules', icon: '🧪', gradient: 'from-green-400/20 to-teal-500/20' },
  { id: 'biology', label: 'Genetics & Biology', icon: '🧬', gradient: 'from-teal-400/20 to-emerald-500/20' },
  { id: 'certifications', label: 'Professional Certs', icon: '🏅', gradient: 'from-yellow-500/20 to-amber-500/20' },
  { id: 'examprep', label: 'Exam & SAT Prep', icon: '📝', gradient: 'from-blue-500/20 to-purple-500/20' },
  { id: 'career', label: 'Career Acceleration', icon: '🚀', gradient: 'from-cyan-500/20 to-indigo-500/20' },
  { id: 'lifelong', label: 'Lifelong Learning', icon: '♾️', gradient: 'from-violet-500/20 to-blue-500/20' },
];

export const TRACK_1: CategoryItem[] = CATEGORIES.slice(0, 9);
export const TRACK_2: CategoryItem[] = CATEGORIES.slice(9, 18);
export const TRACK_3: CategoryItem[] = CATEGORIES.slice(18);
