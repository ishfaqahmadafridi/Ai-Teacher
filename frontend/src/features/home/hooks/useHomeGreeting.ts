'use client';

import { useEffect, useState } from 'react';

/**
 * Custom hook to generate a contextual greeting based on local time.
 */
export function useHomeGreeting() {
  const [greeting, setGreeting] = useState('Welcome');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Good Morning');
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  return greeting;
}
