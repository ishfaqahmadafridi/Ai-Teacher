import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import type { ProtectedRouteProps } from '@/features/auth/types';

export default function ProtectedLayout({ children }: ProtectedRouteProps) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
