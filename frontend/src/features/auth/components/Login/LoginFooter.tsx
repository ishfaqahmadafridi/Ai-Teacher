'use client';

import Link from 'next/link';

export function LoginFooter() {
  return (
    <div className="mt-8 text-center text-[#c4c5d9] font-['Inter',sans-serif] text-sm">
      Don't have an account?{' '}
      <Link href="/register" className="text-[#b8c3ff] hover:underline font-semibold ml-1">
        Create Account
      </Link>
    </div>
  );
}
