'use client';

import { memo } from 'react';
import { PrincipleItemRow } from './PrincipleItemRow';
import type { PrinciplesListProps } from '../../types/board.types';

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
