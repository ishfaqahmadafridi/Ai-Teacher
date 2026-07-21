'use client';

import { useRouter } from 'next/navigation';
import type { DesktopNavProps } from '../../types/nav_types';

export function DesktopNav({ links }: DesktopNavProps) {
  const router = useRouter();

  return (
    <nav className="hidden md:flex items-center gap-8">
      {links.map((link) => (
        <button
          key={link.href}
          onClick={() => {
            router.push(link.href);
          }}
          className="text-sm font-medium text-blue-100/70 hover:text-white transition-colors duration-200 no-underline bg-transparent border-none cursor-pointer outline-none"
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {link.label}
        </button>
      ))}
    </nav>
  );
}


