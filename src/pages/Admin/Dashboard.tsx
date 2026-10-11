import { useSelector } from 'react-redux';

type AuthState = { auth: { user: { name?: string | null; email: string; role: string } | null } };

export default function Dashboard() {
  const user = useSelector((state: AuthState) => state.auth.user);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium uppercase tracking-wider text-clay">{user?.role} workspace</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Welcome, {user?.name || user?.email}</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Use the menu to open the tools allowed by your assigned role. An administrator can update your access from Users and Roles.
      </p>
    </section>
  );
}
