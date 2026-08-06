'use client';

import { memo } from 'react';
import type { PrincipleItemRowProps } from '../../types/board.types';

export const PrincipleItemRow = memo(function PrincipleItemRow({
  item,
  index,
}: PrincipleItemRowProps) {
  const num = index + 1;

  return (
    <li className="flex items-start gap-4 group">
      {/* Number Badge */}
      <div className="mt-0.5 w-6 h-6 rounded-full bg-[#333539] flex items-center justify-center border border-white/5 group-hover:border-[#b8c3ff]/50 transition-colors shrink-0">
        <span className="text-[11px] font-semibold text-[#c4c5d9] group-hover:text-[#b8c3ff] transition-colors">
          {num}
        </span>
      </div>

      {/* Text Content */}
      <div>
        <h4 className="font-['Hanken_Grotesk',sans-serif] text-sm md:text-base font-semibold text-[#e2e2e8] mb-1 group-hover:text-[#b8c3ff] transition-colors">
          {item.title}
        </h4>
        <p className="font-['Hanken_Grotesk',sans-serif] text-xs md:text-sm text-[#c4c5d9] leading-relaxed">
          {item.description}
        </p>
      </div>
    </li>
  );
});

PrincipleItemRow.displayName = 'PrincipleItemRow';
