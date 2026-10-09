'use client';

import { memo } from 'react';
import { InputBarToasts } from './toolbar/InputBarToasts';
import { InputBarDockContainer } from './toolbar/InputBarDockContainer';

export const InputBar = memo(function InputBar() {
  return (
    <div className="flex flex-col gap-2.5 font-sans max-w-6xl mx-auto w-full px-2">
      {/* System Error Banner & Reaction Toast Notifications */}
      <InputBarToasts />

      {/* Main Zoom Meeting Control Dock */}
      <InputBarDockContainer />

    </div>
  );
});

InputBar.displayName = 'InputBar';
