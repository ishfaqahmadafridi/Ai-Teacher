export interface SubjectItem {
  name: string;
  icon: string;
}

export const popularSubjects: SubjectItem[] = [
  { name: 'Math', icon: '∑' },
  { name: 'Programming', icon: '</>' },
  { name: 'Artificial Intelligence', icon: '🧠' },
  { name: 'Data Science', icon: '📊' },
  { name: 'Law', icon: '⚖️' },
  { name: 'Graphic Design', icon: '🎨' },
];

export const aiRecommendations: SubjectItem[] = [
  { name: 'Astrophysics', icon: '🚀' },
  { name: 'Molecular Biology', icon: '🔬' },
  { name: 'Macroeconomics', icon: '🏛️' },
  { name: 'Mandarin Chinese', icon: '🌐' },
];

export const allSubjects: SubjectItem[] = [
  { name: 'History', icon: '📜' },
  { name: 'Philosophy', icon: '💡' },
  { name: 'Physics', icon: '⚡' },
  { name: 'Art History', icon: '🖌️' },
  { name: 'Chemistry', icon: '🧪' },
  { name: 'Psychology', icon: '🧩' },
  { name: 'Literature', icon: '📚' },
  { name: 'Sociology', icon: '👥' },
];

export const customSuggestions: string[] = [
  'Robotics & Automation',
  'Neuroscience',
  'Game Development',
  'Quantum Computing',
  'Bioinformatics',
  'Financial Engineering',
];
