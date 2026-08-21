export const DEFAULT_SIDEBAR_USER = {
  name: 'Alex Rivers',
  rank: 'Pro Learner • 850 XP',
  initials: 'U',
} as const;

export const DEFAULT_EMPTY_STATE = {
  title: 'Interactive Chat Assistant',
  description: 'Ask anything about formulas, concepts, algorithms, code reviews, or physics textbooks. The AI Tutor is ready to assist you.',
} as const;

export const DEFAULT_ATTACHMENT_CONFIG = {
  imageTypes: 'image/*',
  docTypes: '.pdf,.doc,.docx,.txt',
} as const;

export const ASK_SIDEBAR_NAV_ITEMS = [
  { id: 'active', label: 'Active Chat', iconName: 'chat', isActive: true },
  { id: 'history', label: 'Chat History', iconName: 'history', isActive: false },
  { id: 'paths', label: 'Learning Paths', iconName: 'paths', isActive: false },
] as const;
