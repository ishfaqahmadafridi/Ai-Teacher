'use client';

import { useRouter } from 'next/navigation';
import { Button } from '../ui';

export function ActionButtons() {
  const router = useRouter();

  return (
    <div className="dash-btn-group">
      <Button 
        onClick={() => router.push('/classroom')}
        className="dash-btn-primary"
      >
        <span>Get Started Free</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </Button>

      <Button className="dash-btn-secondary">
        {/* Play Icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ color: '#93c5fd' }}
        >
          <path d="M8 5v14l11-7z" />
        </svg>
        <span>Watch Demo</span>
      </Button>
    </div>
  );
}
