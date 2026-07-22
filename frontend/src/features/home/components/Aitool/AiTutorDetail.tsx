'use client';

import Image from 'next/image';

export function AiTutorDetail() {
  return (
    <section className="feat-section border-b border-white/5 pb-20" id="ai-tutor-detail">
      <div className="future-flex" style={{ gap: '48px', alignItems: 'center' }}>
        {/* Left Side: Content */}
        <div className="future-left">
          <span className="feat-subtitle">Proprietary Engine</span>
          <h2 className="feat-title" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', marginBottom: '20px' }}>
            AI Tutor
          </h2>
          <p className="feat-desc" style={{ fontSize: '15.5px', lineHeight: '1.75', color: 'rgba(224, 242, 254, 0.7)' }}>
            Learn faster with an intelligent AI Tutor that delivers personalized lessons through 
            step-by-step explanations, practical examples, interactive 3D models, dynamic 
            animations, diagrams, quizzes, and real-world scenarios. The AI continuously adapts 
            to your progress, identifies learning gaps, and provides customized guidance, making 
            even the most challenging concepts easier to understand and remember.
          </p>
        </div>

        {/* Right Side: Hologram Image Showcase */}
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
                transform: 'none', // flat rendering for wide scene looks cleaner
              }}
            >
              <Image
                src="/ai-tutor-scene.jpg"
                alt="AI Tutor Holographic Showcase"
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

export default AiTutorDetail;
