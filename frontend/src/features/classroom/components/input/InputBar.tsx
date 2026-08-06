'use client';

import { memo } from 'react';
import { FloatingInteractionBar } from './FloatingInteractionBar';

export const InputBar = memo(function InputBar() {
  return <FloatingInteractionBar />;
});

InputBar.displayName = 'InputBar';
