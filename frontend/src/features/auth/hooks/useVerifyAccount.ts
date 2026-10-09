'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { AuthService } from '../services/authService';
import { verifyOtpSchema } from '../validators/auth.schema';
import type { VerificationMethod } from '../types';

export function useVerifyAccount() {
  const router = useRouter();
  const { mutateAsync: resend } = useMutation({ mutationFn: AuthService.resendOtp });
  const { mutateAsync: verify } = useMutation({ mutationFn: (input: { method: string; code: string }) => AuthService.verifyOtp(input.method, input.code) });

  const [method, setMethod] = useState<VerificationMethod>('email');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState<number>(59);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleSelectMethod = (newMethod: VerificationMethod) => {
    setMethod(newMethod);
    setOtp(['', '', '', '', '', '']);
    setError(null);
    setTimer(59);
    // Focus first input
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 50);
  };

  const handleChangeOtp = (index: number, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    if (!cleanValue && value !== '') return;

    const newOtp = [...otp];
    newOtp[index] = cleanValue.slice(-1);
    setOtp(newOtp);
    setError(null);

    // Auto-advance focus to next digit
    if (cleanValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDownOtp = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePasteOtp = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    setError(null);

    // Focus box after last pasted digit
    const nextFocusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const handleResend = useCallback(async () => {
    if (timer > 0) return;
    setIsLoading(true);
    setError(null);
    try {
      await resend(method);
      setTimer(59);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Verification code could not be sent.');
    } finally {
      setIsLoading(false);
    }
  }, [method, timer, resend]);

  const handleSubmit = async () => {
    const code = otp.join('');
    const validation = verifyOtpSchema.safeParse({ method, code });

    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await verify({ method, code });
      setSuccess(true);
      setTimeout(() => {
        router.push('/onboarding/step-3');
      }, 1500);
    } catch (error: unknown) {
      setSuccess(false);
      setError(error instanceof Error ? error.message : 'Account verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    method,
    otp,
    timer,
    isLoading,
    error,
    success,
    inputRefs,
    handleSelectMethod,
    handleChangeOtp,
    handleKeyDownOtp,
    handlePasteOtp,
    handleResend,
    handleSubmit,
  };
}
