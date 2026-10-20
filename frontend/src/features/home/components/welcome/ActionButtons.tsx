'use client';

import { useCallback } from 'react';
import { ArrowRight, Play, Compass } from 'lucide-react';
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
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Button>

      <Button onClick={onWatchDemo ?? (() => router.push('/features'))} className="dash-btn-secondary">
        {onWatchDemo ? <Play aria-hidden="true" className="h-4 w-4" /> : <Compass aria-hidden="true" className="h-4 w-4" />}
        <span>{onWatchDemo ? 'Watch demo' : 'Explore features'}</span>
      </Button>
    </div>
  );
}
