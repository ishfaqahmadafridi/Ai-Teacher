import type { FeatureHighlightItem } from '../types/intro.types';

export const FEATURE_HIGHLIGHTS: FeatureHighlightItem[] = [
  {
    id: 'simulator',
    title: 'AI Physics Simulator',
    subtitle: 'Interactive 3D Motion & Forces',
    description: 'Experience gravity, projectile trajectories, kinematics, and wave equations rendered live with real-time vector visualization.',
    icon: '⚛️',
    badge: 'Core Feature',
    gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    previewType: 'simulator',
  },
  {
    id: 'voice',
    title: 'Voice-Guided AI Tutor',
    subtitle: 'Natural Voice Conversation',
    description: 'Ask questions verbally or type in natural language. Listen to real-time audio explanations synthesized with human clarity.',
    icon: '🎙️',
    badge: 'Real-Time Audio',
    gradient: 'from-purple-500/20 via-indigo-500/10 to-transparent',
    previewType: 'voice',
  },
  {
    id: 'blackboard',
    title: 'Interactive Blackboard',
    subtitle: 'Step-by-Step Diagramming',
    description: 'Watch math proofs, free-body diagrams, and chemical equations drawn on screen step-by-step as your teacher explains.',
    icon: '🎨',
    badge: 'Dynamic Canvas',
    gradient: 'from-blue-500/20 via-cyan-500/10 to-transparent',
    previewType: 'blackboard',
  },
  {
    id: 'analytics',
    title: 'Adaptive Learning Curve',
    subtitle: 'Real-Time Concept Mastery',
    description: 'Track your comprehension curve across topics, get automated quiz recommendations, and achieve 100% mastery.',
    icon: '📊',
    badge: 'Smart Progress',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    previewType: 'analytics',
  },
];
