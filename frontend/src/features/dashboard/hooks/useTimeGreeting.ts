'use client';
import { useBrowserGreeting } from '@/shared/hooks/useBrowserGreeting';
export function useTimeGreeting(initialGreeting = 'Good Morning'): string {
  return useBrowserGreeting(initialGreeting);
}
