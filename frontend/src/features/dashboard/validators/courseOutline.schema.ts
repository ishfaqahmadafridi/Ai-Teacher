import { z } from 'zod';
export const courseOutlineSchema = z.object({
  topics: z.array(z.string().trim().min(1).max(255)).max(60),
  source: z.enum(['', 'manual', 'ai']),
  updated_at: z.string().nullable(),
});
