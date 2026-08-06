import type React from 'react';

/**
 * Creates an OnKeyDown handler that triggers a callback when the 'Enter' key is pressed.
 */
export function createEnterKeyHandler(onEnter: () => void) {
  return (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEnter();
    }
  };
}
