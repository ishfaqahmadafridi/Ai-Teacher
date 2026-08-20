'use client';

import { memo, useCallback } from 'react';
import Link from 'next/link';
import type { ConsentLinkProps } from '../../../types/createAccount.types';

export const ConsentLink = memo(function ConsentLink({ href, text }: ConsentLinkProps) {
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
});

ConsentLink.displayName = 'ConsentLink';
