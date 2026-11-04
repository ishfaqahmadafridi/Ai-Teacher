import { z } from 'zod';
import { ASSEMBLY_PART_IDS, MOLECULE_ATOMS, SCHEMATIC_BOUNDS } from '../constants/conceptualVisualConstants';

const id = z.string().trim().min(1).max(SCHEMATIC_BOUNDS.idLength);
const label = z.string().trim().min(1).max(SCHEMATIC_BOUNDS.labelLength);
const coordinate = z.number().finite().min(0).max(1);

export const schematicVisualSchema = z.object({
  kind: z.literal('schematic'), title: label,
  nodes: z.array(z.object({ id, label, x: coordinate, y: coordinate })).min(1).max(SCHEMATIC_BOUNDS.nodes),
  edges: z.array(z.object({ source: id, target: id, label: label.optional() })).max(SCHEMATIC_BOUNDS.edges),
  focus: id.optional(),
}).superRefine((visual, ctx) => {
  const ids = new Set(visual.nodes.map(node => node.id));
  const edges = new Set(visual.edges.map(edge => JSON.stringify([edge.source, edge.target])));
  if (ids.size !== visual.nodes.length || (visual.focus && !ids.has(visual.focus)) ||
      edges.size !== visual.edges.length || visual.edges.some(edge => edge.source === edge.target || !ids.has(edge.source) || !ids.has(edge.target))) {
    ctx.addIssue({ code: 'custom', message: 'Invalid diagram references.' });
  }
});

export const assemblyVisualSchema = z.object({
  kind: z.literal('assembly'), model: z.enum(['bridge', 'beam', 'piston', 'pulley', 'molecule']),
  molecule: z.enum(['water', 'carbon_dioxide', 'methane']).optional(),
  phase: coordinate.optional(), focus: id.optional(),
}).superRefine((visual, ctx) => {
  const parts: readonly string[] = ASSEMBLY_PART_IDS[visual.model];
  const invalidMolecule = visual.model === 'molecule' ? !visual.molecule : !!visual.molecule;
  const atomIndex = visual.focus?.startsWith('atom_') ? Number(visual.focus.slice(5)) : undefined;
  if (invalidMolecule || (visual.focus && !parts.includes(visual.focus)) ||
      (atomIndex !== undefined && visual.molecule && atomIndex >= MOLECULE_ATOMS[visual.molecule].length)) {
    ctx.addIssue({ code: 'custom', message: 'Unsupported model or part.' });
  }
});

// Invalid optional visuals cannot prevent the spoken lesson from playing.
export const optionalLessonVisualSchema = z.union([
  schematicVisualSchema, assemblyVisualSchema,
  z.object({ kind: z.literal('tree'), nodes: z.array(z.object({ id: z.string(), label: z.string(), parent: z.string().nullable().optional() })).min(1).max(31) }),
  z.object({ kind: z.literal('polynomial'), coefficients: z.array(z.number().finite().min(-10000).max(10000)).min(1).max(6), x_min: z.number().finite().min(-100).max(100), x_max: z.number().finite().min(-100).max(100) }).refine(visual => visual.x_min < visual.x_max),
]).optional().catch(undefined);
