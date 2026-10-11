import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import type { RootState } from '../app/store';
import { hasPermission } from '../features/auth/permissions';

export default function PermissionRoute({ permission }: { permission: string }) {
  const user = useSelector((state: RootState) => state.auth.user);
  return hasPermission(user, permission) ? <Outlet /> : <div role="alert" className="p-8 text-center text-muted">You do not have permission to view this page. Ask an administrator to update your role.</div>;
}
