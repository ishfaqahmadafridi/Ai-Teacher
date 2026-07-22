'use client';

import { useState } from 'react';
import { Input } from '../ui/Input/Input';
import { Label } from '../ui/Label/Label';
import { Button } from '../ui/Button/Button';
import { cn } from '../../utils';
import type { PasswordFieldProps } from '../../types';

export function PasswordField({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  required,
  autoComplete,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="block text-[14px] font-semibold leading-5 tracking-[0.05em] uppercase px-1"
        style={{ color: 'rgba(229, 226, 227, 0.8)', fontFamily: 'Inter, sans-serif' }}
      >
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          className={cn(
            'w-full px-5 py-4 pr-12 rounded-xl text-[#e5e2e3] placeholder:text-[#c6c6cc]/40',
            'bg-black/20 border border-white/10 outline-none',
            'transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
            'focus:border-[#b8c3ff] focus:shadow-[0_0_15px_rgba(184,195,255,0.2)] focus:bg-black/30',
            'focus-visible:ring-0 focus-visible:ring-offset-0'
          )}
          style={{ fontFamily: 'Inter, sans-serif' }}
        />
        <Button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-transparent border-none text-[#c6c6cc]/60 hover:text-[#e5e2e3] transition-colors h-auto shadow-none"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          )}
        </Button>
      </div>
    </div>
  );
}
