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
export type AnatomyModelId = 'heart' | 'brain' | 'skeleton';
export interface AnatomyVisual { kind: 'anatomy'; model: AnatomyModelId; focus?: string }
export interface AnatomyPartEntry { id: string; label: string }
export interface AnatomyModelEntry { title: string; asset: string; parts: readonly AnatomyPartEntry[] }
export type LessonVisual = TreeVisual | PolynomialVisual | SchematicVisual | AssemblyVisual | AnatomyVisual;
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
export interface AnatomyVisualProps { visual: AnatomyVisual }
export interface AnatomyModelProps { asset: string; partIds: readonly string[]; focus?: string }
export interface AnatomyPartMaterial {
  part?: string;
  baseColor: string;
  material: { color: { set: (color: string) => unknown }; emissive: { set: (color: string) => unknown }; emissiveIntensity: number; dispose: () => void };
}
export type AnatomyAssetStatus = 'checking' | 'ready' | 'missing';
/** What the anatomy panel shows: loading notice, interactive 3D model, or labelled 2D fallback. */
export type AnatomyViewMode = 'checking' | 'model' | 'fallback';
