'use client';
import { useBrowserGreeting } from '@/shared/hooks/useBrowserGreeting';
export function useHomeGreeting() { return useBrowserGreeting('Welcome'); }
