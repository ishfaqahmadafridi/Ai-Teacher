'use client';

import { memo } from 'react';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import type { ProtectedRouteProps } from '../types';

export const ProtectedRoute = memo(function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { allowed, error, retry } = useProtectedRoute();
  if (error) return <div role="alert"><p>{error}</p><button type="button" onClick={retry}>Try again</button></div>;
  if (!allowed) return null;
  return <>{children}</>;
});

ProtectedRoute.displayName = 'ProtectedRoute';
