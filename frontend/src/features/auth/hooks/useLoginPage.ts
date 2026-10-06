'use client';

import { useLogin } from './useLogin';

/** Keep the visible login page on the same validated API flow as other login forms. */
export function useLoginPage() {
  const login = useLogin();
  return {
    ...login,
    error: login.error || Object.values(login.fieldErrors).find(Boolean) || '',
  };
}
