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
        className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-300 relative overflow-hidden flex items-center justify-center gap-2 mt-4 cursor-pointer"
        style={{
          background: isLoading
            ? 'rgba(46,91,255,0.4)'
            : 'linear-gradient(135deg, #2e5bff 0%, #1a43d6 100%)',
          boxShadow: isLoading ? 'none' : '0 0 20px rgba(46,91,255,0.35)',
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
            CREATE ACCOUNT
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </>
        )}
      </Button>

      {/* Already have an account */}
      <div className="mt-4 text-center text-[#c4c5d9] font-['Inter',sans-serif] text-sm">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-[#b8c3ff] hover:underline font-semibold ml-1"
        >
          Sign In
        </Link>
      </div>
    </>
  );
}

