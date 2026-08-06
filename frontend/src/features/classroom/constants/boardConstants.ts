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
