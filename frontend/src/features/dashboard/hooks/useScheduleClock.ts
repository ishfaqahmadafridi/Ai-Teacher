'use client';

import { useSyncExternalStore } from 'react';

const listeners = new Set<() => void>();
let timestamp = Date.now();
let timer: ReturnType<typeof setInterval> | undefined;
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    timestamp = Date.now();
    timer = setInterval(() => {
      timestamp = Date.now();
      listeners.forEach((notify) => notify());
    }, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}
export function useScheduleClock() {
  return useSyncExternalStore(subscribe, () => timestamp, () => 0);
}
