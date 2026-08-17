'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function useRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
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
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);

    // Save initial full name & email to onboarding store in localStorage for Step 3 synchronization
    if (typeof window !== 'undefined') {
      try {
        const storedOb = localStorage.getItem('onboarding-store');
        const parsedOb = storedOb ? JSON.parse(storedOb) : { state: {} };
        parsedOb.state = {
          ...parsedOb.state,
          currentStep: 3,
          profile: {
            ...parsedOb.state?.profile,
            fullName: form.fullName || parsedOb.state?.profile?.fullName || '',
          },
        };
        localStorage.setItem('onboarding-store', JSON.stringify(parsedOb));
      } catch (e) {
        console.error('Failed to pre-fill onboarding-store during register', e);
      }
    }

    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    router.push('/onboarding/step-3');
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
