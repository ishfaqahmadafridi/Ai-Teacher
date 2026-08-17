'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { UseIntroScreenReturn } from '../types/intro.types';

export function useIntroScreen(): UseIntroScreenReturn {
  const router = useRouter();
  const [activeFeature, setActiveFeature] = useState<string>('simulator');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const handleEnterPlatform = useCallback(() => {
    router.push('/home');
  }, [router]);

  const handleLogin = useCallback(() => {
    router.push('/login');
  }, [router]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return {
    activeFeature,
    setActiveFeature,
    handleEnterPlatform,
    handleLogin,
    isScrolled,
  };
}
