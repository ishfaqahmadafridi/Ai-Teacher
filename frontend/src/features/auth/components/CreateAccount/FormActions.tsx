'use client';

import Link from 'next/link';
import { Button } from '../ui/Button/Button';

interface FormActionsProps {
  isLoading: boolean;
}

export function FormActions({ isLoading }: FormActionsProps) {
  return (
    <>
      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full py-5 rounded-xl uppercase tracking-widest flex items-center justify-center gap-2 mt-8 font-semibold text-[14px] leading-5 transition-all duration-300 h-auto"
        style={{
          background: isLoading
            ? 'rgba(0, 67, 235, 0.4)'
            : 'linear-gradient(135deg, #0043eb 0%, #b8c3ff 150%)',
          boxShadow: isLoading ? 'none' : '0 0 20px rgba(0, 67, 235, 0.35)',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          color: isLoading ? '#c6ceff' : '#001356',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
              <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Creating Account…
          </span>
        ) : (
          <>
            Continue
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </>
        )}
      </Button>

      {/* Already have an account */}
      <div className="mt-4 text-center">
        <p
          className="text-[16px] leading-6"
          style={{ color: '#c6c6cc', fontFamily: 'Inter, sans-serif' }}
        >
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-[#b8c3ff] font-bold hover:text-[#c6ceff] transition-colors ml-1"
          >
            Sign In
          </Link>
        </p>
      </div>
    </>
  );
}
