import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../state/authStore';
import { AuthService } from '../services/authService';
import { registerSchema } from '../validators/auth.schema';
import type { RegisterFormData } from '../types';

export interface UseRegisterReturn {
  form: RegisterFormData;
  fieldErrors: Partial<Record<keyof RegisterFormData, string>>;
  showPassword: boolean;
  isLoading: boolean;
  error: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleConsentChange: (field: 'agreeToTerms' | 'agreeToPrivacy', checked: boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  togglePassword: () => void;
}

const initialForm: RegisterFormData = {
  firstName: '',
  lastName: '',
  username: '',
  mobile: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
  agreeToPrivacy: false,
};

export function useRegister(): UseRegisterReturn {
  const router = useRouter();
  const { setUser, setLoading, setError, isLoading, error } = useAuthStore();

  const [form, setForm] = useState<RegisterFormData>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    setError(null);
  }, [setError]);

  const handleConsentChange = useCallback(
    (field: 'agreeToTerms' | 'agreeToPrivacy', checked: boolean) => {
      setForm((prev) => ({ ...prev, [field]: checked }));
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const result = registerSchema.safeParse(form);
      if (!result.success) {
        const errors: Partial<Record<keyof RegisterFormData, string>> = {};
        result.error.issues.forEach((issue) => {
          const key = issue.path[0] as keyof RegisterFormData;
          errors[key] = issue.message;
        });
        setFieldErrors(errors);
        return;
      }

      setLoading(true);
      try {
        const data = await AuthService.register(form);
        setUser(data.user, data.access);
        router.push('/classroom');
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Registration failed. Please try again.';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [form, router, setError, setLoading, setUser]
  );

  return {
    form,
    fieldErrors,
    showPassword,
    isLoading,
    error,
    handleChange,
    handleConsentChange,
    handleSubmit,
    togglePassword,
  };
}

