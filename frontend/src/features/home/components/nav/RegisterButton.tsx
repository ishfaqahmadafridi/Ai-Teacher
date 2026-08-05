'use client';

import Link from 'next/link';
import type { RegisterButtonProps } from '../../types/nav_types';

export function RegisterButton({
  className = '',
  href = '/register',
  onClick,
  children = 'Register',
}: RegisterButtonProps) {
  return (
    <Link
      href={href}
      id="navbar-register-btn"
      onClick={onClick}
      className={`hidden md:inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full font-semibold text-sm no-underline text-white bg-gradient-to-r from-[#3b82f6] to-[#6366f1] shadow-[0_0_18px_rgba(99,102,241,0.35)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:-translate-y-0.5 hover:scale-[1.03] transition-all duration-300 ${className}`}
    >
      {children}
    </Link>
  );
}
