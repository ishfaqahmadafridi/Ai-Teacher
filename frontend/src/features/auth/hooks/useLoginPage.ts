'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function useLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  }, []);

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);

    let hasCompletedOnboarding = false;
    if (typeof window !== 'undefined') {
      try {
        const storedOb = localStorage.getItem('onboarding-store');
        if (storedOb) {
          const parsed = JSON.parse(storedOb);
          if (parsed?.state?.selectedInterests?.length > 0 || parsed?.state?.currentStep > 3) {
            hasCompletedOnboarding = true;
          }
        }
      } catch (e) {
        console.error('Failed to read onboarding-store', e);
      }
    }

    if (hasCompletedOnboarding) {
      router.push('/dashboard');
    } else {
      router.push('/onboarding/step-3');
    }
  }, [form, router]);

  return {
    form,
    showPassword,
    isLoading,
    error,
    handleChange,
    togglePassword,
    handleSubmit,
  };
}
