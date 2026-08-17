'use client';

import { useEffect, useState } from 'react';
import { getTimeGreeting } from '../utilities/greetingUtils';

/**
 * Custom hook to generate a contextual greeting based on local client time.
 * Prevents SSR hydration mismatch by computing time post-mount on client.
 */
export function useTimeGreeting(initialGreeting = 'Good Morning'): string {
  const [greeting, setGreeting] = useState<string>(initialGreeting);

  useEffect(() => {
    setGreeting(getTimeGreeting());
  }, []);

  return greeting;
}
