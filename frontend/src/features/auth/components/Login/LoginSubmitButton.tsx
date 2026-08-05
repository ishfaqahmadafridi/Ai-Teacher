'use client';

import type { LoginSubmitButtonProps } from '../../types';

export function LoginSubmitButton({ isLoading = false, disabled = false }: LoginSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading || disabled}
      className="w-full bg-[#2e5bff] text-[#efefff] rounded-lg py-3.5 px-4 font-['Inter',sans-serif] font-semibold flex items-center justify-center gap-2 hover:bg-[#254edb] hover:shadow-[0_0_20px_rgba(46,91,255,0.4)] transition-all mt-8 disabled:opacity-50 disabled:cursor-not-allowed text-base cursor-pointer"
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          SIGNING IN...
        </span>
      ) : (
        <>
          SIGN IN
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </>
      )}
    </button>
  );
}
