import type { PrincipleItem } from '../components/board/board.types';

export const DEFAULT_PRINCIPLES: PrincipleItem[] = [
  {
    id: 1,
    title: 'Force and Acceleration',
    description: 'The acceleration of an object depends directly upon the net force acting upon the object.',
    colorVariant: 'primary',
  },
  {
    id: 2,
    title: 'Mass Dependency',
    description: 'Acceleration depends inversely upon the mass of the object. Heavier objects require more force.',
    colorVariant: 'secondary',
  },
  {
    id: 3,
    title: 'Directionality',
    description: 'The direction of acceleration is always in the direction of the net applied force vector.',
    colorVariant: 'tertiary',
  },
];

export const DEFAULT_PRIMARY_EQUATION = 'F = m * a';
export const DEFAULT_EQUATION_LABEL = 'Primary Equation';
export const DEFAULT_PRINCIPLES_TITLE = 'Core Principles';

export interface AtomOrbitConfig {
  radius: number;
  speed: number;
  color: string;
  electronColor: string;
  phaseOffset: number;
}

export const ATOM_ORBITS: readonly AtomOrbitConfig[] = [
  { radius: 1.1, speed: 1.2, color: '#60a5fa', electronColor: '#3b82f6', phaseOffset: 0 },
  { radius: 1.8, speed: 0.7, color: '#a78bfa', electronColor: '#8b5cf6', phaseOffset: 1.1 },
  { radius: 2.5, speed: 0.45, color: '#34d399', electronColor: '#10b981', phaseOffset: 2.3 },
] as const;

export interface SamplePhysicsPrompt {
  id: string;
  icon: string;
  topic: string;
  prompt: string;
}

export const SAMPLE_PHYSICS_PROMPTS: SamplePhysicsPrompt[] = [
  {
    id: 'newton2',
    icon: '⚡',
    topic: "Newton's 2nd Law",
    prompt: "Explain Newton's Second Law of Motion F = m · a with step-by-step examples",
  },
  {
    id: 'gravity',
    icon: '🌍',
    topic: 'Gravitational Force',
    prompt: 'Derive Universal Gravitation F = G(m1·m2)/r^2 and planetary orbits',
  },
  {
    id: 'projectile',
    icon: '🎯',
    topic: 'Projectile Trajectory',
    prompt: 'How to calculate maximum height and velocity range in parabolic projectile motion',
  },
  {
    id: 'waves',
    icon: '🌊',
    topic: 'Wave Interference',
    prompt: 'Explain constructive vs destructive wave interference and frequency',
  },
];
