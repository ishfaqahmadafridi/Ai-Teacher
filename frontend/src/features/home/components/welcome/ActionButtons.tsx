'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/state/authStore';
import { Button } from '../ui';
import type { ActionButtonsProps } from '../../types';

export function ActionButtons({
  onGetStarted,
  onWatchDemo,
  className = '',
}: ActionButtonsProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const handleGetStarted = useCallback(() => {
    if (onGetStarted) {
      onGetStarted();
      return;
    }
    if (isAuthenticated) {
      router.push('/classroom');
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, onGetStarted, router]);

  return (
    <div className={`dash-btn-group ${className}`}>
      <Button 
        onClick={handleGetStarted}
        className="dash-btn-primary"
      >
        <span>Get Started Free</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </Button>

      <Button onClick={onWatchDemo} className="dash-btn-secondary">
        {/* Play Icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-blue-300"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
        <span>Watch Demo</span>
      </Button>
    </div>
  );
}
