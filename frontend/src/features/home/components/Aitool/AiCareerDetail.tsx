'use client';

import Image from 'next/image';

export function AiCareerDetail() {
  return (
    <section className="feat-section border-b border-white/5 pb-20" id="ai-career-detail">
      <div className="future-flex" style={{ gap: '48px', alignItems: 'center' }}>
        {/* Left Side: Content */}
        <div className="future-left">
          <span className="feat-subtitle" style={{ color: '#a78bfa' }}>Professional Engine</span>
          <h2 className="feat-title" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', marginBottom: '20px' }}>
            AI Career Guidance
          </h2>
          <p className="feat-desc" style={{ fontSize: '15.5px', lineHeight: '1.75', color: 'rgba(224, 242, 254, 0.7)' }}>
            Discover the right career path with personalized roadmaps, skill-gap analysis, 
            industry recommendations, interview preparation, certifications, and job-ready 
            learning plans tailored to your goals. Empowering you to gain the specific 
            competencies required by top employers and map out a clear trajectory for 
            long-term career growth and professional mastery.
          </p>
        </div>

        {/* Right Side: Career Hologram Image Showcase */}
        <div className="future-right">
          <div className="future-mockup-container" style={{ maxWidth: '540px', aspectRatio: '16/9' }}>
            <div className="future-mockup-glow" style={{ width: '400px', height: '240px', background: 'radial-gradient(circle, rgba(167, 139, 250, 0.18) 0%, transparent 70%)' }} />
            <div 
              className="future-mockup-img" 
              style={{ 
                width: '100%', 
                height: '100%', 
                borderRadius: '24px', 
                border: '1px solid rgba(255, 255, 255, 0.08)',
                transform: 'none', // flat rendering
              }}
            >
              <Image
                src="/ai-career-scene.jpg"
                alt="AI Career Guidance Holographic Showcase"
                fill
                sizes="(max-width: 768px) 100vw, 540px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AiCareerDetail;
