'use client';

import { memo } from 'react';
import { INPUT_BASE_CLASSES } from '../../constants';
import { getInputStyle } from '../../utilities';
import type { UsernameSectionProps } from '../../types';

export const UsernameSection = memo(function UsernameSection({
  username,
  usernameError,
  onChange,
}: UsernameSectionProps) {
  return (
    <div>
      <label htmlFor="username" className="block text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-2">
        Username <span className="text-red-400">*</span>
      </label>
      <input
        id="username"
        name="username"
        type="text"
        autoComplete="username"
        value={username}
        onChange={onChange}
        placeholder="johndoe"
        className={INPUT_BASE_CLASSES}
        style={getInputStyle(usernameError)}
      />
      {usernameError && <p className="text-xs text-red-400 mt-1">{usernameError}</p>}
    </div>
  );
});

UsernameSection.displayName = 'UsernameSection';
