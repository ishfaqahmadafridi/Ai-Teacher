'use client';

export function HeroSection() {
  return (
    <>
      {/* Title */}
      <h1
        className="m-0 text-center font-extrabold tracking-tight max-w-[900px]"
        style={{
          fontSize: 'clamp(42px, 6.5vw, 88px)',
          lineHeight: 1.08,
          animation: 'intro-titleReveal 1.0s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both',
        }}
      >
        <span className="block text-[#f0f6ff]">The Future of</span>
        <span
          className="block bg-gradient-to-r from-blue-300 via-blue-400 to-violet-400 bg-[length:200%_auto] bg-clip-text text-transparent"
          style={{
            animation: 'intro-shimmer 5s linear infinite',
          }}
        >
          Learning Starts Here
        </span>
      </h1>

      {/* Description */}
      <p
        className="mt-6 mb-0 font-sans text-center text-blue-100/60 max-w-[560px]"
        style={{
          fontSize: 'clamp(15px, 1.8vw, 19px)',
          lineHeight: 1.65,
          animation: 'intro-subtitleReveal 1.0s cubic-bezier(0.16, 1, 0.3, 1) 0.85s both',
        }}
      >
        Intelligent, adaptive education for every learner — from first grade to lifelong mastery, across every discipline on earth.
      </p>
    </>
  );
}
