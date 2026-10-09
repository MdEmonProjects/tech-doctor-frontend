import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  isLoading?: boolean;
  redirectTo?: string;
  fallback?: ReactNode;
}

// Supply these values from your authentication provider when adding private pages.
export function ProtectedRoute({
  isAuthenticated,
  isLoading = false,
  redirectTo = '/login',
  fallback = <div className="p-12 text-center" role="status">Checking your session…</div>,
}: ProtectedRouteProps) {
  const location = useLocation();

  if (isLoading) return fallback;
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }
  return <Outlet />;
}
