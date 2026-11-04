import { ZodError } from 'zod';

export function classroomErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ZodError) {
    return 'This lesson could not be loaded because its format is invalid. Please try again.';
  }
  return error instanceof Error ? error.message : fallback;
}
