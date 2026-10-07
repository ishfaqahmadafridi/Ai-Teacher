'use client';
import { useSyncExternalStore } from 'react';
import { getTimeGreeting } from '../utilities/greetingUtils';
import { GREETING_REFRESH_INTERVAL } from '../constants/queryConstants';
function subscribe(notify: () => void) {
  const timer = setInterval(notify, GREETING_REFRESH_INTERVAL);
  return () => clearInterval(timer);
}
export function useBrowserGreeting(initialGreeting: string) {
  return useSyncExternalStore(subscribe, getTimeGreeting, () => initialGreeting);
}
