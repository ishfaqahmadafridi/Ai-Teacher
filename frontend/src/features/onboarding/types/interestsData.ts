export interface SubjectItem {
  name: string;
}

export interface SubjectCategory {
  id: string;
  title: string;
  badge: string;
  items: SubjectItem[];
}

export const subjectCategories: SubjectCategory[] = [
  {
    id: 'cs_it',
    title: 'Computer Science & Technology',
    badge: 'Tech',
    items: [
      { name: 'Computer Science (CS)' },
      { name: 'Artificial Intelligence (AI)' },
      { name: 'Software Engineering (SE)' },
      { name: 'Data Science & Analytics' },
      { name: 'Cyber Security' },
      { name: 'Web & App Development' },
    ],
  },
  {
    id: 'medical_health',
    title: 'Medical & Healthcare Sciences',
    badge: 'Medical',
    items: [
      { name: 'MBBS (Medicine)' },
      { name: 'Medical Sciences' },
      { name: 'Surgery & Clinical Practice' },
      { name: 'Nursing & Patient Care' },
      { name: 'Pharmacy & Pharmacology' },
      { name: 'Neuroscience' },
      { name: 'Biotechnology' },
    ],
  },
  {
    id: 'sciences',
    title: 'Pure & Applied Sciences',
    badge: 'Sciences',
    items: [
      { name: 'Mathematics & Calculus' },
      { name: 'Physics' },
      { name: 'Chemistry' },
      { name: 'Biology & Genetics' },
    ],
  },
  {
    id: 'humanities',
    title: 'Humanities & Social Sciences',
    badge: 'Humanities',
    items: [
      { name: 'History' },
      { name: 'Economics' },
      { name: 'Psychology' },
      { name: 'Law & Legal Studies' },
      { name: 'Philosophy' },
      { name: 'Literature' },
    ],
  },
  {
    id: 'business_design',
    title: 'Business, Management & Design',
    badge: 'Business',
    items: [
      { name: 'Business Administration' },
      { name: 'Digital Marketing' },
      { name: 'Graphic & UI/UX Design' },
      { name: 'Finance & Accounting' },
    ],
  },
];

export const popularSubjects: SubjectItem[] = subjectCategories.flatMap((cat) => cat.items);

export const customSuggestions: string[] = [
  'Human Anatomy & Physiology',
  'Robotics & Automation',
  'Biomedical Engineering',
  'Public Health & Epidemiology',
  'Quantum Computing',
  'Financial Technology (FinTech)',
];
