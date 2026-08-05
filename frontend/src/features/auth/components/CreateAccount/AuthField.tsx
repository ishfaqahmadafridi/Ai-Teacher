'use client';

import { memo } from 'react';
import { Input } from '../ui/Input/Input';
import { Label } from '../ui/Label/Label';
import { cn } from '../../utils';
import type { AuthFieldProps } from '../../types';

export const AuthField = memo(function AuthField({
  id,
  name,
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  required,
  autoComplete,
  error,
  className,
}: AuthFieldProps) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={cn('space-y-1.5', className)}>
      <Label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-wider text-[#90a4ae] font-['Inter',sans-serif]"
      >
        {label}
      </Label>
      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        className={cn(
          'w-full px-4 py-2.5 rounded-xl text-sm text-[#e1e2eb] placeholder-[#5c6b89]',
          'bg-[#171c28] border outline-none',
          error
            ? 'border-[#ff5252] focus:border-[#ff5252] focus:shadow-[0_0_15px_rgba(255,82,82,0.25)]'
            : 'border-[#2c3345] focus:border-[#2e5bff] focus:shadow-[0_0_15px_rgba(46,91,255,0.25)]',
          'transition-all duration-200 ease-in-out focus:bg-[#1a202e]',
          "focus-visible:ring-0 focus-visible:ring-offset-0 font-['Inter',sans-serif]"
        )}
      />
      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-xs text-[#ff5252] pl-1 font-['Inter',sans-serif]"
        >
          {error}
        </p>
      )}
    </div>
  );
});

AuthField.displayName = 'AuthField';



