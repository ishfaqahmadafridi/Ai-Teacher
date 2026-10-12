import axios from 'axios';
import { z } from 'zod';
const noteErrorSchema = z.object({ detail: z.string().optional(), language: z.array(z.string()).optional(), non_field_errors: z.array(z.string()).optional() });
export function noteErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) return fallback;
  const parsed = noteErrorSchema.safeParse(error.response?.data);
  if (!parsed.success) return fallback;
  return parsed.data.detail || parsed.data.language?.[0] || parsed.data.non_field_errors?.[0] || fallback;
}
