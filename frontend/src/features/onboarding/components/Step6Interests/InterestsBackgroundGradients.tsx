'use client';

export function InterestsBackgroundGradients() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#0043eb]/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#ddb7ff]/10 rounded-full blur-[140px]" />
    </div>
  );
}
