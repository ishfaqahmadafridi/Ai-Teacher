export interface TreeVisual { kind: 'tree'; nodes: { id: string; label: string; parent?: string | null }[] }
export interface PolynomialVisual { kind: 'polynomial'; coefficients: number[]; x_min: number; x_max: number }
export interface SchematicVisual {
  kind: 'schematic'; title: string;
  nodes: { id: string; label: string; x: number; y: number }[];
  edges: { source: string; target: string; label?: string }[];
  focus?: string;
}
export interface AssemblyVisual {
  kind: 'assembly'; model: 'bridge' | 'beam' | 'piston' | 'pulley' | 'molecule';
  molecule?: 'water' | 'carbon_dioxide' | 'methane'; phase?: number; focus?: string;
}
export type LessonVisual = TreeVisual | PolynomialVisual | SchematicVisual | AssemblyVisual;
export interface LessonVisualProps { visual: LessonVisual }
export interface LegacyVisualProps { visual: TreeVisual | PolynomialVisual }
export interface SchematicVisualProps { visual: SchematicVisual }
export type SchematicLayoutNode = SchematicVisual['nodes'][number] & { px: number; py: number };
export type VisualVector = [number, number, number];
export interface ConceptualPart {
  id: string; label: string; shape: 'box' | 'sphere' | 'cylinder' | 'torus';
  position: VisualVector; size: VisualVector; rotation?: VisualVector; color: string;
}
export interface AssemblyVisualProps { visual: AssemblyVisual }
export interface AssemblyPartProps { part: ConceptualPart; highlighted: boolean; showLabel: boolean }
