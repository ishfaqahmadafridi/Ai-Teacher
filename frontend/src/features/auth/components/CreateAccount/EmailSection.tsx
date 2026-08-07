'use client';

import { memo } from 'react';
import { INPUT_BASE_CLASSES } from '../../constants';
import { getInputStyle } from '../../utilities';
import type { EmailSectionProps } from '../../types';

export const EmailSection = memo(function EmailSection({
  email,
  emailError,
  onChange,
}: EmailSectionProps) {
  return (
    <div>
      <label htmlFor="reg-email" className="block text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-2">
        Email Address <span className="text-red-400">*</span>
      </label>
      <input
        id="reg-email"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={onChange}
        placeholder="john@example.com"
        className={INPUT_BASE_CLASSES}
        style={getInputStyle(emailError)}
      />
      {emailError && <p className="text-xs text-red-400 mt-1">{emailError}</p>}
    </div>
  );
});

EmailSection.displayName = 'EmailSection';
