'use client';

import { memo } from 'react';
import { useFullscreenInputDock } from '../../hooks/useFullscreenInputDock';
import { InputBarToasts } from './toolbar/InputBarToasts';
import { InputBarDockContainer } from './toolbar/InputBarDockContainer';
import { InputBarPlaybackRow } from './toolbar/InputBarPlaybackRow';

export const InputBar = memo(function InputBar() {
  const toolbarRef = useFullscreenInputDock();
  return (
    <div ref={toolbarRef} className="flex flex-col gap-2.5 font-sans w-full px-2">
      {/* System Error Banner & Reaction Toast Notifications */}
      <InputBarToasts />
      <InputBarPlaybackRow />

      {/* Main Zoom Meeting Control Dock */}
      <InputBarDockContainer />

    </div>
  );
});

InputBar.displayName = 'InputBar';
