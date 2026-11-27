import type { ComponentProps } from 'react';
import type { Text } from '@react-three/drei';
export interface EquationCardProps {
  label?: string;
  formula?: string;
  className?: string;
}

export interface SimulationHeaderProps {
  title?: string;
  badgeText?: string;
  className?: string;
}

export interface SimulationCanvasProps {
  className?: string;
}

export interface SimulationPaneProps {
  title?: string;
  badgeText?: string;
  className?: string;
}

export interface PrincipleItem {
  id: string | number;
  title: string;
  description: string;
  colorVariant?: 'primary' | 'secondary' | 'tertiary';
}

export interface PrincipleItemRowProps {
  item: PrincipleItem;
  index: number;
}

export interface PrinciplesListProps {
  principles: PrincipleItem[];
  className?: string;
}

export interface PaneHeaderProps {
  title: string;
  className?: string;
}

export interface PrinciplesNotesPaneProps {
  title?: string;
  principles?: PrincipleItem[];
  formula?: string;
  formulaLabel?: string;
  className?: string;
}

export interface SplitWhiteboardStageProps {
  className?: string;
}

export interface SceneProps {
  type: import('@/types').DiagramType;
  command: import('@/types').DiagramCommand | null;
}

export interface DiagramStageProps {
  diagramType: import('@/types').DiagramType;
  command: import('@/types').DiagramCommand | null;
  formula: string | null;
}

export interface DiagramCanvasProps {
  diagramType: import('@/types').DiagramType;
  command: import('@/types').DiagramCommand | null;
}

export interface FormulaOverlayProps {
  command: import('@/types').DiagramCommand | null;
  formula: string | null;
}

export interface GravitySceneProps {
  command: import('@/types').DiagramCommand | null;
}

export interface ProjectileSceneProps {
  command: import('@/types').DiagramCommand | null;
}

export interface WaveSceneProps {
  command: import('@/types').DiagramCommand | null;
  resolution?: number;
  width?: number;
  baseAmplitude?: number;
  baseFrequency?: number;
  baseSpeed?: number;
  color?: string;
}

export interface ImageSceneProps {
  command: import('@/types').DiagramCommand | null;
  url: string;
}

export interface ChalkboardHeaderProps {
  topic?: string | null;
  isWriting?: boolean;
  showGrid?: boolean;
  onToggleGrid?: () => void;
  className?: string;
}

export interface ChalkboardTrayProps {
  className?: string;
}

export interface ChalkboardWelcomeSlateProps {
  onSelectSamplePrompt?: (prompt: string) => void;
  className?: string;
}

export interface ChalkboardNotesViewProps {
  points: string[];
  isWriting: boolean;
  className?: string;
}

export interface FormattedFormulaProps { formula: string }
export interface FormulaToken { text: string; className: string }

export type DiagramLabelProps = Omit<ComponentProps<typeof Text>, 'font'>;

/** A point in 3D scene space. */
export type Vec3 = [number, number, number];

/** Playback multiplier for each lesson `speed` command. */
export interface SceneSpeedScale { slow: number; normal: number; fast: number }

export interface SceneTitleProps { children: string; fontSize?: number }

export interface WaveParameters { amplitude: number; frequency: number; speed: number }

/** Resolved wave scene settings after props and lesson command are applied. */
export interface WaveSceneSettings extends WaveParameters {
  resolution: number;
  width: number;
  color: string;
}
