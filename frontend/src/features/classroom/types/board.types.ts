export interface EquationCardProps {
  label?: string;
  formula?: string;
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
