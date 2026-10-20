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
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm no-underline text-white bg-dashboard-primary hover:bg-dashboard-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dashboard-primary transition-colors ${className}`}
    >
      {children}
    </Link>
  );
}
