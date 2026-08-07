'use client';

import { memo } from 'react';
import { INPUT_BASE_CLASSES } from '../../constants';
import { getInputStyle } from '../../utilities';
import type { IdentitySectionProps } from '../../types';

export const IdentitySection = memo(function IdentitySection({
  firstName,
  lastName,
  firstNameError,
  lastNameError,
  onChange,
}: IdentitySectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label htmlFor="firstName" className="block text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-2">
          First Name <span className="text-red-400">*</span>
        </label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          autoComplete="given-name"
          value={firstName}
          onChange={onChange}
          placeholder="John"
          className={INPUT_BASE_CLASSES}
          style={getInputStyle(firstNameError)}
        />
        {firstNameError && <p className="text-xs text-red-400 mt-1">{firstNameError}</p>}
      </div>
      <div>
        <label htmlFor="lastName" className="block text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-2">
          Last Name <span className="text-red-400">*</span>
        </label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          autoComplete="family-name"
          value={lastName}
          onChange={onChange}
          placeholder="Doe"
          className={INPUT_BASE_CLASSES}
          style={getInputStyle(lastNameError)}
        />
        {lastNameError && <p className="text-xs text-red-400 mt-1">{lastNameError}</p>}
      </div>
    </div>
  );
});

IdentitySection.displayName = 'IdentitySection';
