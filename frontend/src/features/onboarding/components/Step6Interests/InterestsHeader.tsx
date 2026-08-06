'use client';

export function InterestsHeader() {
  return (
    <div className="space-y-2">
      <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        Choose What You Want to Learn
      </h2>
      <p className="text-[#c6c6cc] text-base max-w-2xl">
        Select from popular subjects or write your own custom field. Our neural network will tailor your learning path based on these choices.
      </p>
    </div>
  );
}
