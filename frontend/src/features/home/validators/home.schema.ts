import { z } from 'zod';

/**
 * Schema defining the contract for home welcome stats data.
 */
export const WelcomeStatsSchema = z.object({
  studentsGlobally: z.string(),
  expertTutors: z.string(),
  rating: z.number().min(0).max(5),
});

export type WelcomeStats = z.infer<typeof WelcomeStatsSchema>;
