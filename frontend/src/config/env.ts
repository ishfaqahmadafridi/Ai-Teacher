import { z } from 'zod';

// Define environment variable schema using Zod
const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default('http://127.0.0.1:8000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Safe parse variables on startup
const parseEnv = () => {
  const result = envSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!result.success) {
    console.error('❌ Invalid environment variables configuration:', result.error.format());
    throw new Error('Environment configuration validation failed.');
  }

  return result.data;
};

export const env = parseEnv();
export default env;
