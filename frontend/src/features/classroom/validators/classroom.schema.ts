import { DIAGRAM_ACTIONS } from '../constants/diagramConstants';
import { z } from 'zod';
import { CIRCUIT_LIMITS } from '../constants/circuitConstants';
import { optionalLessonVisualSchema } from './conceptualVisual.schema';

const animationSchema = z.object({ object: z.string(), move: z.string(), speed: z.string() });

export const diagramCommandSchema = z.object({
  visual: optionalLessonVisualSchema,
  fallback_visual: optionalLessonVisualSchema,
  visual_status: z.enum(['retrieved', 'unavailable', 'fallback']).optional().catch(undefined),
  visual_reason: z.string().optional(),
  parameters: z.object({ voltage: z.number().finite().min(CIRCUIT_LIMITS.voltage.min).max(CIRCUIT_LIMITS.voltage.max), resistance: z.number().finite().min(CIRCUIT_LIMITS.resistance.min).max(CIRCUIT_LIMITS.resistance.max) }).optional(),
  action: z.enum(DIAGRAM_ACTIONS).catch('none'),
  target: z.string().optional(), speed: z.enum(['slow', 'fast']).optional(), formula: z.string().optional(),
  animate: animationSchema.optional(),
  annotation: z.string().optional(), annotation_position: z.string().optional(),
}).passthrough();

export const diagramTypeSchema = z.enum(['gravity', 'electric_field', 'projectile', 'wave', 'circuit', 'atom', 'image', 'default']);
const teacherPositionSchema = z.enum(['left', 'center', 'right']);

export const phaseSchema = z.object({
  phase: z.number(),
  name: z.string(),
  speak: z.string(),
  key_point: z.string().optional().nullable(),
  joke: z.string().optional().nullable(),
  teacher_position: teacherPositionSchema.default('left'),
  diagram_action: z.string().optional().nullable(),
  diagram_target: z.string().optional().nullable(),
  animate: z.record(z.string(), z.unknown()).optional().nullable(),
  annotation: z.string().optional().nullable(),
  annotation_position: z.tuple([z.number(), z.number(), z.number()]).optional().nullable(),
  formulas: z.array(z.object({ line: z.number(), speak: z.string(), display: z.string() })).optional(),
  wait_for_answer: z.boolean().optional(),
});

export const teachingResponseSchema = z.object({
  topic: z.string(),
  language: z.string().default('en'),
  diagram_type: diagramTypeSchema.default('default'),
  phases: z.array(phaseSchema),
  topic_map: z.array(z.string()).optional(),
});

export type ValidatedTeachingResponse = z.infer<typeof teachingResponseSchema>;
export type ValidatedPhase = z.infer<typeof phaseSchema>;
export type ValidatedDiagramCommand = z.infer<typeof diagramCommandSchema>;

export const classroomChunkSchema = z.object({
  discussion_prompt: z.string().min(1).max(2000).optional(),
  question: z.string().min(1).max(2000).optional(),
  expected_concepts: z.array(z.string()).max(10).optional(),
  speak: z.string(),
  key_point: z.string().nullable().optional(),
  teacher_position: teacherPositionSchema.optional(),
  diagram: diagramCommandSchema.optional(),
});

export const classroomAnswerSchema = z.object({
  model_info: z.object({ note_id: z.uuid().optional() }).optional(),
  chunks: z.array(classroomChunkSchema).min(1),
  topic: z.string(), language: z.string(),
  diagram_type: diagramTypeSchema.catch('default'),
});
