'use client';

import { memo } from 'react';
import Link from 'next/link';
import type { FormSubmitButtonProps } from '../../types';

export const FormSubmitButton = memo(function FormSubmitButton({
  isLoading,
  loadingText = 'Creating Account...',
  buttonText = 'Create Account',
}: FormSubmitButtonProps) {
  return (
    <>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl py-3.5 text-white font-bold text-sm uppercase tracking-widest transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        style={{
          background: isLoading
            ? 'rgba(37,99,235,0.6)'
            : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          boxShadow: isLoading ? 'none' : '0 4px 24px rgba(37,99,235,0.4)',
        }}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {loadingText}
          </>
        ) : (
          <>
            {buttonText}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </>
        )}
      </button>

      <p className="text-center text-[#64748b] text-sm pt-2">
        Already have an account?{' '}
        <Link href="/login" className="text-[#38bdf8] hover:text-[#7dd3fc] font-semibold transition-colors">
          Sign In
        </Link>
      </p>
    </>
  );
});

FormSubmitButton.displayName = 'FormSubmitButton';
