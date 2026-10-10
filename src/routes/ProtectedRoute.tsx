import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children?: ReactNode;
  isLoading?: boolean;
  redirectTo?: string;
  userRole?: string | null;
  allowedRoles?: string[];
  forbiddenTo?: string;
  fallback?: ReactNode;
}

// Supply these values from your authentication provider when adding private pages.
export function ProtectedRoute({
  isAuthenticated,
  children,
  isLoading = false,
  redirectTo = '/login',
  userRole,
  allowedRoles,
  forbiddenTo = '/dashboard',
  fallback = <div className="p-12 text-center" role="status">Checking your session…</div>,
}: ProtectedRouteProps) {
  const location = useLocation();

  if (isLoading) return fallback;
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }
  if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
    return <Navigate to={forbiddenTo} replace />;
  }
  return children ?? <Outlet />;
}
