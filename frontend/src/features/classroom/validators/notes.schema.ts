import { z } from 'zod';
export const savedLectureNoteSchema = z.object({
  id: z.uuid(), version: z.string(), created_at: z.string().optional(), title: z.string(), language: z.string(),
  source_language: z.string(), direction: z.enum(['ltr', 'rtl']), extra_llm_tokens: z.number(),
  sources: z.array(z.object({ title: z.string(), url: z.url(), number: z.number() })).default([]),
  figure_indices: z.array(z.number().int().nonnegative()).default([]),
  sections: z.array(z.object({ key_point: z.string(), explanation: z.string(), formula: z.string(), annotation: z.string(), image_source: z.string().default('') })).min(1),
});
export const savedLectureNotesSchema = z.array(savedLectureNoteSchema);
