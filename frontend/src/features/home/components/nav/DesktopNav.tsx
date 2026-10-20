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
          className="text-sm font-medium text-dashboard-muted hover:text-dashboard-text transition-colors duration-200 no-underline bg-transparent border-none cursor-pointer focus-visible:outline-2 focus-visible:outline-dashboard-primary"
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {link.label}
        </button>
      ))}
    </nav>
  );
}


