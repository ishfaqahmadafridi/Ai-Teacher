import { z } from 'zod';

export const diagramCommandSchema = z.object({
  action: z.enum(['show_initial', 'rotate', 'highlight', 'pause_and_explain', 'show_formula', 'none']),
  target: z.string().optional(),
  animate: z.record(z.string(), z.any()).optional(),
  annotation: z.string().optional().nullable(),
  annotation_position: z.tuple([z.number(), z.number(), z.number()]).optional(),
  formula: z.string().optional().nullable(),
});

export const phaseSchema = z.object({
  phase: z.number(),
  name: z.string(),
  speak: z.string(),
  key_point: z.string().optional().nullable(),
  joke: z.string().optional().nullable(),
  teacher_position: z.enum(['left', 'right', 'center']).default('left'),
  diagram_action: z.string().optional().nullable(),
  diagram_target: z.string().optional().nullable(),
  animate: z.record(z.string(), z.any()).optional().nullable(),
  annotation: z.string().optional().nullable(),
  annotation_position: z.tuple([z.number(), z.number(), z.number()]).optional().nullable(),
});

export const teachingResponseSchema = z.object({
  topic: z.string(),
  language: z.string().default('en'),
  diagram_type: z.enum(['gravity', 'projectile', 'wave', 'circuit', 'atom', 'electric_field', 'image', 'default']).default('default'),
  phases: z.array(phaseSchema),
});

export type ValidatedTeachingResponse = z.infer<typeof teachingResponseSchema>;
export type ValidatedPhase = z.infer<typeof phaseSchema>;
export type ValidatedDiagramCommand = z.infer<typeof diagramCommandSchema>;
