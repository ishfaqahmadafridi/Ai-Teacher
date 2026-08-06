export function AmbientGlows() {
  return (
    <>
      {/* Top-left blue glow */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: '-200px',
          left: '-200px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(184, 195, 255, 0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      />
      {/* Bottom-right purple glow */}
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: '-200px',
          right: '-200px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(221, 183, 255, 0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      />
    </>
  );
}
