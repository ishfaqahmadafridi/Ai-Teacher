'use client';

import { memo } from 'react';
import { Input } from '../../ui/Input/Input';
import { cn } from '../../../utils';

interface PasswordInputProps {
  id: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  required?: boolean;
  autoComplete?: string;
  error?: string;
}

/**
 * Stateless password <input> — switches between type="password" and type="text"
 * based on the `showPassword` prop passed from the parent.
 * Includes aria-invalid + aria-describedby for WCAG 2.1 AA compliance.
 */
export const PasswordInput = memo(function PasswordInput({
  id,
  name,
  placeholder,
  value,
  onChange,
  showPassword,
  required,
  autoComplete,
  error,
}: PasswordInputProps) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <Input
      id={id}
      name={name}
      type={showPassword ? 'text' : 'password'}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      autoComplete={autoComplete}
      aria-invalid={Boolean(error)}
      aria-describedby={errorId}
      className={cn(
        'w-full px-4 py-2.5 pr-11 rounded-xl text-sm text-[#e1e2eb] placeholder-[#5c6b89]',
        'bg-[#171c28] border outline-none',
        error
          ? 'border-[#ff5252] focus:border-[#ff5252] focus:shadow-[0_0_15px_rgba(255,82,82,0.25)]'
          : 'border-[#2c3345] focus:border-[#2e5bff] focus:shadow-[0_0_15px_rgba(46,91,255,0.25)]',
        'transition-all duration-200 ease-in-out focus:bg-[#1a202e]',
        "focus-visible:ring-0 focus-visible:ring-offset-0 font-['Inter',sans-serif]"
      )}
    />
  );
});

PasswordInput.displayName = 'PasswordInput';
