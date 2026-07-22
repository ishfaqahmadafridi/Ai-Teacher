'use client';

import { Input } from '../ui/Input/Input';
import { Label } from '../ui/Label/Label';
import { cn } from '../../utils';
import type { AuthFieldProps } from '../../types';

export function AuthField({
  id,
  name,
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  required,
  autoComplete,
}: AuthFieldProps) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="block text-[14px] font-semibold leading-5 tracking-[0.05em] uppercase px-1"
        style={{ color: 'rgba(229, 226, 227, 0.8)', fontFamily: 'Inter, sans-serif' }}
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
        className={cn(
          'w-full px-5 py-4 rounded-xl text-[#e5e2e3] placeholder:text-[#c6c6cc]/40',
          'bg-black/20 border border-white/10 outline-none',
          'transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
          'focus:border-[#b8c3ff] focus:shadow-[0_0_15px_rgba(184,195,255,0.2)] focus:bg-black/30',
          'focus-visible:ring-0 focus-visible:ring-offset-0'
        )}
        style={{ fontFamily: 'Inter, sans-serif' }}
      />
    </div>
  );
}
