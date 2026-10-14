'use client';
import { useState } from 'react';
export function useVisualImage() {
  const [failed, setFailed] = useState(false);
  return { failed, onError: () => setFailed(true) };
}
