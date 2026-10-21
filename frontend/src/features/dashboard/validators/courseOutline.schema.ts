import { z } from 'zod';
import { COURSE_OUTLINE_MAX_TOPICS, COURSE_OUTLINE_MAX_TITLE_LENGTH } from '../constants/courseOutlineConstants';
export const courseOutlineSchema = z.object({
  period: z.object({ start_date: z.string(), duration_months: z.number().int() }).nullable().default(null),
  weeks: z.array(z.object({ number: z.number().int(), start: z.string(), end: z.string(), quiz: z.object({ number: z.number().int(), title: z.string(), topics: z.array(z.string()) }).nullable().default(null), items: z.array(z.object({ assignments: z.array(z.object({ exercise: z.string(), instruction: z.string() })).default([]), title: z.string(), subtopics: z.array(z.string()), exercises: z.array(z.string()), activity: z.enum(['Lesson', 'Practice', 'Review']) })) })).default([]),
  details: z.array(z.object({ title: z.string(), subtopics: z.array(z.string()), exercises: z.array(z.string()) })).default([]),
  sessions: z.array(z.object({ title: z.string(), day: z.string(), date: z.string(), start: z.string(), end: z.string(), timezone: z.string() })).default([]),
  topics: z.array(z.string().trim().min(1).max(COURSE_OUTLINE_MAX_TITLE_LENGTH)).max(COURSE_OUTLINE_MAX_TOPICS),
  source: z.enum(['', 'manual', 'ai']),
  updated_at: z.string().nullable(),
});
