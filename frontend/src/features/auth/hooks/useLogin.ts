import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../state/authStore';
import { useLoginMutation } from './useAuthQueries';
import { loginSchema } from '../validators/auth.schema';
import type { LoginFormData } from '../types';

export interface UseLoginReturn {
  form: LoginFormData;
  fieldErrors: Partial<Record<keyof LoginFormData, string>>;
  showPassword: boolean;
  isLoading: boolean;
  error: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  togglePassword: () => void;
}

const initialForm: LoginFormData = {
  email: '',
  password: '',
  rememberMe: false,
};

export function useLogin(): UseLoginReturn {
  const { mutateAsync, isPending } = useLoginMutation();
  const router = useRouter();
  const { setUser, setError, error } = useAuthStore();

  const [form, setForm] = useState<LoginFormData>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [showPassword, setShowPassword] = useState(false);

  // Clear global error state on mount & unmount
  useEffect(() => {
    setError(null);
    return () => setError(null);
  }, [setError]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    setError(null);
  }, [setError]);

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const result = loginSchema.safeParse(form);
      if (!result.success) {
        const errors: Partial<Record<keyof LoginFormData, string>> = {};
        result.error.issues.forEach((issue) => {
          const key = issue.path[0] as keyof LoginFormData;
          errors[key] = issue.message;
        });
        setFieldErrors(errors);
        return;
      }

      try {
        const data = await mutateAsync(result.data);
        setUser(data.user, data.access, data.refresh);

        if (data.user.onboardingCompleted) {
          router.push('/dashboard');
        } else {
          router.push('/onboarding/step-3');
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
        setError(message);
      }
    },
    [form, router, setError, setUser, mutateAsync]
  );

  return {
    form,
    fieldErrors,
    showPassword,
    isLoading: isPending,
    error,
    handleChange,
    handleSubmit,
    togglePassword,
  };
}
