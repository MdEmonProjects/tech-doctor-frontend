import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';

type AuthState = {
  auth: {
    user: { name?: string | null; email: string; role: string } | null;
  };
};

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: AuthState) => state.auth.user);

  const signOut = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} className="font-serif text-xl font-semibold">
            Tech Doctor <span className="text-clay">Portal</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <div className="hidden text-right sm:block">
              <p className="font-medium">{user?.name || user?.email}</p>
              <p className="text-xs uppercase tracking-wide text-slate-500">{user?.role}</p>
            </div>
            <button
              type="button"
              onClick={signOut}
              className="rounded-lg border border-slate-300 px-3 py-2 font-medium transition hover:bg-slate-100"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
