'use client';

import { useState, useCallback, memo } from 'react';
import { Label } from '../../ui/Label/Label';
import { PasswordInput } from './PasswordInput';
import { PasswordToggleButton } from './PasswordToggleButton';
import type { PasswordFieldProps } from '../../../types';

/**
 * PasswordField — stateful wrapper that owns the show/hide toggle.
 *
 * Responsibility split:
 *   PasswordField          → owns showPassword state + layout
 *   PasswordInput          → stateless <input> (type switches on showPassword prop)
 *   PasswordToggleButton   → accessible eye toggle button
 *   PasswordEyeIcon        → pure SVG icons (EyeIcon / EyeOffIcon)
 */
export const PasswordField = memo(function PasswordField({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  required,
  autoComplete,
  error,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-wider text-[#90a4ae] font-['Inter',sans-serif]"
      >
        {label}
      </Label>

      <div className="relative">
        <PasswordInput
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          showPassword={showPassword}
          required={required}
          autoComplete={autoComplete}
          error={error}
        />
        <PasswordToggleButton showPassword={showPassword} onToggle={togglePassword} />
      </div>

      {error && errorId && (
        <p
          id={errorId}
          role="alert"
          aria-live="polite"
          className="text-xs text-[#ff5252] pl-1 font-['Inter',sans-serif]"
        >
          {error}
        </p>
      )}
    </div>
  );
});

PasswordField.displayName = 'PasswordField';
