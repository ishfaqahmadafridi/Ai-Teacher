'use client';

interface CategoryPillProps {
  icon: string;
  label: string;
}

export function CategoryPill({ icon, label }: CategoryPillProps) {
  return (
    <div
      className="intro-category-pill inline-flex items-center gap-2 px-[18px] py-[9px] rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md whitespace-nowrap cursor-default select-none transition-all duration-200"
      style={{
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <span className="text-sm leading-none">{icon}</span>
      <span className="font-sans text-[12px] font-medium text-blue-100/75 tracking-wide">
        {label}
      </span>
    </div>
  );
}
