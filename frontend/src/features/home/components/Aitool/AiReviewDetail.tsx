'use client';

import Image from 'next/image';

export function AiReviewDetail() {
  return (
    <section className="feat-section border-b border-dashboard-border pb-20" id="ai-review-detail">
      <div className="future-flex" style={{ gap: '48px', alignItems: 'center' }}>
        {/* Left Side: Review Hologram Image Showcase */}
        <div className="future-right md:order-1">
          <div className="future-mockup-container" style={{ maxWidth: '540px', aspectRatio: '16/9' }}>
            <div className="future-mockup-glow" style={{ width: '400px', height: '240px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)' }} />
            <div 
              className="future-mockup-img" 
              style={{ 
                width: '100%', 
                height: '100%', 
                borderRadius: '24px', 
                border: '1px solid var(--color-dashboard-border)',
                transform: 'none', // flat rendering
              }}
            >
              <Image
                src="/ai-review-scene.jpg"
                alt="AI Assignment Review Holographic Showcase"
                fill
                sizes="(max-width: 768px) 100vw, 540px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="future-left md:order-2">
          <span className="feat-subtitle" >Evaluation Engine</span>
          <h2 className="feat-title" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', marginBottom: '20px' }}>
            AI Assignment Review
          </h2>
          <p className="feat-desc" style={{ fontSize: '15.5px', lineHeight: '1.75', color: 'var(--color-dashboard-muted)' }}>
            Upload assignments to receive detailed AI feedback, grammar corrections, plagiarism 
            insights, code reviews, improvement suggestions, and personalized recommendations 
            before submission. Our evaluator uses semantic analysis to ensure structural consistency, 
            style compatibility, correct citation practices, and logical flow across documents.
          </p>
        </div>
      </div>
    </section>
  );
}

export default AiReviewDetail;
