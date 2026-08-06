import type { TailoredLevelTab, TailoredFeatureCard } from '../../types';

export const LEVEL_TABS: TailoredLevelTab[] = [
  { id: 'k12', label: 'K-12 Education', iconName: 'book' },
  { id: 'university', label: 'University Degrees', iconName: 'graduation-cap' },
  { id: 'professional', label: 'Professional Mastery', iconName: 'briefcase' },
];

export const TAB_CARDS: Record<TailoredLevelTab['id'], TailoredFeatureCard[]> = {
  k12: [
    {
      title: 'Neural Tutor',
      description: '24/7 AI companion that explains complex concepts, solves problems, and adapts to your style.',
      iconName: 'sparkles',
    },
    {
      title: 'Instant Summarizer',
      description: 'Condense massive 2-hour lectures or textbook chapters into clear mind maps and key guides.',
      iconName: 'book',
    },
    {
      title: 'Adaptive Quizzes',
      description: 'Automatically creates diagnostic multiple choice questions mapping back to your cognitive gaps.',
      iconName: 'checkbox',
    },
    {
      title: 'Global Bridge',
      description: 'Translate complex lectures or syllabus materials in real time to study comfortably in your native tongue.',
      iconName: 'laptop',
    },
  ],
  university: [
    {
      title: 'Academic Research Buddy',
      description: 'Find, summarize, and reference verified peer-reviewed articles to draft pristine thesis structures.',
      iconName: 'book',
    },
    {
      title: 'Math & Proof Solver',
      description: 'Interactive step-by-step proofs for complex logic, calculus, and abstract algebra equations.',
      iconName: 'sparkles',
    },
    {
      title: 'Exam Simulator',
      description: 'Adaptive mock tests based on historical syllabus models tailored to gauge university degree finals.',
      iconName: 'checkbox',
    },
    {
      title: 'Lab Notebook Assistant',
      description: 'Analyze statistics, plot high-precision data structures, and validate scientific experimental formulas.',
      iconName: 'laptop',
    },
  ],
  professional: [
    {
      title: 'Career Copilot',
      description: 'AI-guided interview prep, resume optimizing, and targeted skill development roadmaps.',
      iconName: 'sparkles',
    },
    {
      title: 'Fast Cert Study',
      description: 'Focused speedruns of key certifications (AWS, PMP, CFA, etc.) with custom flashcards.',
      iconName: 'book',
    },
    {
      title: 'Skill Diagnostics',
      description: 'Find career knowledge gaps and recommend targeted exercises to stay ahead of market demands.',
      iconName: 'checkbox',
    },
    {
      title: 'Cross-Domain Sync',
      description: 'Translate executive terminology between technical, financial, and product frameworks.',
      iconName: 'laptop',
    },
  ],
};
