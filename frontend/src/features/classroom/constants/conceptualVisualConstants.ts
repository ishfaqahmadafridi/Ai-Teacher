export const CONCEPTUAL_COLORS = { structure: '#64748b', moving: '#2563eb', support: '#475569', focus: '#f59e0b', oxygen: '#dc2626', carbon: '#334155', hydrogen: '#e2e8f0', bond: '#94a3b8' };
export const SCHEMATIC_BOUNDS = { nodes: 12, edges: 24, idLength: 40, labelLength: 80, width: 600, height: 380, padding: 65, nodeWidth: 110, nodeHeight: 44, gap: 16 };
export const ASSEMBLY_PART_IDS = {
  bridge: ['deck', 'left_support', 'right_support', 'left_brace', 'right_brace'],
  beam: ['beam', 'left_support', 'right_support', 'load'],
  piston: ['cylinder', 'piston', 'rod'],
  pulley: ['wheel', 'axle', 'rope', 'load'],
  molecule: ['atom_0', 'atom_1', 'atom_2', 'atom_3', 'atom_4', 'bonds'],
} as const;
export const MOLECULE_ATOMS = {
  water: [
    { element: 'O', position: [0, 0, 0] },
    { element: 'H', position: [0.76, 0.59, 0] },
    { element: 'H', position: [-0.76, 0.59, 0] },
  ],
  carbon_dioxide: [
    { element: 'C', position: [0, 0, 0] },
    { element: 'O', position: [-1.16, 0, 0] },
    { element: 'O', position: [1.16, 0, 0] },
  ],
  methane: [
    { element: 'C', position: [0, 0, 0] },
    { element: 'H', position: [0.63, 0.63, 0.63] },
    { element: 'H', position: [-0.63, -0.63, 0.63] },
    { element: 'H', position: [-0.63, 0.63, -0.63] },
    { element: 'H', position: [0.63, -0.63, -0.63] },
  ],
} as const;
export const ELEMENT_COLORS = { O: CONCEPTUAL_COLORS.oxygen, H: CONCEPTUAL_COLORS.hydrogen, C: CONCEPTUAL_COLORS.carbon };
export const ELEMENT_LABELS = { O: 'Oxygen', H: 'Hydrogen', C: 'Carbon' };
export const ASSEMBLY_VIEW = { camera: [6, 4, 7] as [number, number, number], fov: 45, segments: 20, minDistance: 3, maxDistance: 18 };
export const CONCEPTUAL_MODEL_NOTICE = 'Conceptual model · not to scale · not an engineering simulation';
