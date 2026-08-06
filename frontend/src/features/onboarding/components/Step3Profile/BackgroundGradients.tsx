'use client';

export function BackgroundGradients() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#002388]/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#6900b3]/20 rounded-full blur-[120px]" />
    </div>
  );
}
