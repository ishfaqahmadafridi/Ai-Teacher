'use client';

import { useCallback } from 'react';
import Link from 'next/link';

interface ConsentLinkProps {
  href: string;
  text: string;
}

/**
 * Renders the styled policy link inside a consent label.
 * Stops click propagation to prevent accidentally toggling the checkbox.
 */
export function ConsentLink({ href, text }: ConsentLinkProps) {
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
  }, []);

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="text-[#b8c3ff] hover:underline transition-colors font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2e5bff] rounded-sm"
    >
      {text}
    </Link>
  );
}
