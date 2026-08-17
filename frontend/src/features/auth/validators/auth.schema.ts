import { z } from 'zod';

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, 'First name is required'),
    lastName: z
      .string()
      .trim()
      .min(1, 'Last name is required'),
    username: z
      .string()
      .trim()
      .min(3, 'Username must be at least 3 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    countryCode: z
      .string()
      .min(1, 'Country code is required'),
    mobile: z
      .string()
      .trim()
      .min(7, 'Mobile number must be at least 7 digits')
      .regex(/^[0-9\s\-+]+$/, 'Invalid mobile number format'),
    email: z
      .string()
      .trim()
      .min(1, 'Email address is required')
      .email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
    agreeToTerms: z.literal(true, {
      message: 'You must agree to the Terms of Service',
    }),
    agreeToPrivacy: z.literal(true, {
      message: 'You must agree to the Privacy Policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

export const verifyOtpSchema = z.object({
  method: z.enum(['email', 'sms']),
  code: z.string().length(6, 'Verification code must be 6 digits'),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;
export type VerifyOtpSchemaType = z.infer<typeof verifyOtpSchema>;
