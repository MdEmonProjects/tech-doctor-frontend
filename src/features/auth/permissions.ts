import type { AuthUser } from './authSlice';

export function hasPermission(user: AuthUser | null | undefined, key: string): boolean {
  return Boolean(user && (user.role === 'ADMIN' || user.permissions?.includes(key)));
}
