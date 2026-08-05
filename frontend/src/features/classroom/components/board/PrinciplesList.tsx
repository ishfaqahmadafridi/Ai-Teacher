'use client';

import { memo } from 'react';
import { PrincipleItemRow } from './PrincipleItemRow';
import type { PrincipleItem } from './board.types';

export interface PrinciplesListProps {
  principles: PrincipleItem[];
  className?: string;
}

export const PrinciplesList = memo(function PrinciplesList({
  principles,
  className = '',
}: PrinciplesListProps) {
  return (
    <ul className={`space-y-4 ${className}`}>
      {principles.map((item, index) => (
        <PrincipleItemRow key={item.id} item={item} index={index} />
      ))}
    </ul>
  );
});

PrinciplesList.displayName = 'PrinciplesList';
