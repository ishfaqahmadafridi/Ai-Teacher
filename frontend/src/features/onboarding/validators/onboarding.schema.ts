import { z } from 'zod';

export const profileStepSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  dob: z.string().min(1, 'Date of birth is required'),
  country: z.string().min(1, 'Please select your country'),
  timezone: z.string().min(1, 'Please select your time zone'),
  avatarUrl: z.string().optional(),
});

export const educationLevelSchema = z.object({
  educationLevel: z.enum(['primary', 'middle', 'high_school', 'undergraduate', 'postgraduate', 'professional', 'self_learner']),
});

export const academicYearSchema = z.object({
  academicYear: z.enum(['freshman', 'sophomore', 'junior', 'senior', 'graduate']),
});

export const interestsStepSchema = z.object({
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
});

export type ProfileStepSchemaType = z.infer<typeof profileStepSchema>;
