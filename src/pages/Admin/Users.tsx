import { useState, type FormEvent } from 'react';
import { useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import type { RootState } from '../../app/store';
import { hasPermission } from '../../features/auth/permissions';
import { useCreateUserMutation, useGetUsersQuery, useGetUserRolesQuery, useSetUserStatusMutation, useUpdateUserMutation, type AccessRole, type ManagedUser } from '../../features/access/accessApi';
import CatalogDialog from '../../components/CatalogDialog';
import { catalogError } from '../../components/RepairServiceDialog';
import { AccessPage, ConfirmAction, QueryFeedback, accessButton, accessInput, accessSecondary } from '../../components/AccessUi';

function UserEditor({ user, roles, onClose }: { user?: ManagedUser; roles: AccessRole[]; onClose: () => void }) {
  const actor = useSelector((state: RootState) => state.auth.user);
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [roleId, setRoleId] = useState(user?.roleId ?? roles.find((role) => role.key === 'STAFF')?.id ?? roles[0]?.id ?? 0);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();
  const busy = creating || updating;
  const selectedRole = roles.find((role) => role.id === roleId);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    if (!selectedRole) { setError('Select an available role.'); return; }
    try {
      setError(null);
      const body = { name: name.trim(), email: email.trim().toLowerCase(), roleId };
      if (user) await updateUser({ id: user.id, ...body, ...(password ? { password } : {}) }).unwrap();
      else await createUser({ ...body, password }).unwrap();
      onClose();
    } catch (failure) { setError(catalogError(failure)); }
  };
  return <CatalogDialog title={user ? 'Edit user' : 'Add user'} onClose={() => !busy && onClose()}>
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm font-semibold text-slate-700">Name<input value={name} onChange={(event) => setName(event.target.value)} maxLength={100} className={accessInput} autoComplete="name" /></label>
      <label className="block text-sm font-semibold text-slate-700">Email *<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} maxLength={320} required className={accessInput} autoComplete="off" /></label>
      <label className="block text-sm font-semibold text-slate-700">Role *<select value={roleId} onChange={(event) => setRoleId(Number(event.target.value))} disabled={actor?.id === user?.id} className={accessInput}>{roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select></label>
      {selectedRole && <div className="rounded-lg bg-slate-50 p-3 text-sm text-muted"><p className="font-semibold text-slate-700">{selectedRole.name} access</p><p className="mt-1">{selectedRole.key === 'ADMIN' ? 'Full dashboard access, including all current and future permissions.' : selectedRole.permissions.length ? selectedRole.permissions.map((entry) => entry.permission.name).join(', ') : 'No dashboard actions assigned yet.'}</p></div>}
      <label className="block text-sm font-semibold text-slate-700">{user ? 'New password (optional)' : 'Password *'}<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} maxLength={72} required={!user} autoComplete="new-password" className={accessInput} /></label>
      <p className="text-xs text-muted">Use at least 8 characters. {user && 'Changing the password signs this user out of existing sessions.'}</p>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4"><button type="button" disabled={busy} onClick={onClose} className={accessSecondary}>Cancel</button><button type="submit" disabled={busy} className={accessButton}>{busy ? 'Saving…' : user ? 'Save changes' : 'Add user'}</button></div>
    </form>
  </CatalogDialog>;
}

export default function Users() {
  const actor = useSelector((state: RootState) => state.auth.user);
  const { data: users = [], isLoading, isError, refetch } = useGetUsersQuery();
  const { data: roles = [], isLoading: rolesLoading, isError: rolesError, refetch: refetchRoles } = useGetUserRolesQuery();
  const [setStatus] = useSetUserStatusMutation();
  const [search, setSearch] = useState('');
  const [status, setStatusFilter] = useState('all');
  const [editor, setEditor] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [statusTarget, setStatusTarget] = useState<ManagedUser | null>(null);
  const filtered = users.filter((user) => `${user.name ?? ''} ${user.email} ${user.assignedRole.name}`.toLowerCase().includes(search.toLowerCase()) && (status === 'all' || user.isActive === (status === 'active')));
  const mayManage = (user: ManagedUser) => actor?.role === 'ADMIN' || roles.some((role) => role.id === user.roleId);
  return <AccessPage title="Users" description="Add staff and other users, assign their roles, and manage account access." action={hasPermission(actor, 'users.create') && <button type="button" disabled={rolesLoading || rolesError || !roles.length} onClick={() => { setEditingUser(null); setEditor(true); }} className={accessButton}><Plus size={17} />Add user</button>}>
    <div className="flex flex-wrap gap-3"><input aria-label="Search users" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, or role" className={`${accessInput} !mt-0 max-w-md`} /><select aria-label="Account status" value={status} onChange={(event) => setStatusFilter(event.target.value)} className={`${accessInput} !mt-0 !w-auto`}><option value="all">All accounts</option><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
    {rolesError && <p role="alert" className="text-sm text-red-600">Role choices could not be loaded. <button type="button" onClick={() => void refetchRoles()} className="underline">Try again</button></p>}
    <QueryFeedback loading={isLoading} failed={isError} retry={() => void refetch()} empty={!filtered.length ? 'No matching users.' : undefined} />
    {!isLoading && !isError && filtered.length > 0 && <div className="overflow-x-auto rounded-lg border border-border"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-muted"><tr><th className="p-3">User</th><th className="p-3">Role</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-border">{filtered.map((user) => <tr key={user.id}><td className="p-3"><p className="font-semibold text-foreground">{user.name || 'Unnamed user'}{actor?.id === user.id && <span className="ml-2 text-xs text-muted">You</span>}</p><p className="text-muted">{user.email}</p></td><td className="p-3">{user.assignedRole.name}</td><td className="p-3"><span className={`rounded-full px-2 py-1 text-xs ${user.isActive ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{user.isActive ? 'Active' : 'Inactive'}</span></td><td className="p-3"><div className="flex justify-end gap-2">{hasPermission(actor, 'users.update') && mayManage(user) && <button type="button" onClick={() => { setEditingUser(user); setEditor(true); }} className={accessSecondary}>Edit</button>}{hasPermission(actor, 'users.deactivate') && mayManage(user) && actor?.id !== user.id && <button type="button" onClick={() => setStatusTarget(user)} className={accessSecondary}>{user.isActive ? 'Deactivate' : 'Activate'}</button>}</div></td></tr>)}</tbody></table></div>}
    {editor && <UserEditor user={editingUser ?? undefined} roles={roles} onClose={() => setEditor(false)} />}
    {statusTarget && <ConfirmAction title={`${statusTarget.isActive ? 'Deactivate' : 'Activate'} user?`} confirmLabel={statusTarget.isActive ? 'Deactivate user' : 'Activate user'} onClose={() => setStatusTarget(null)} onConfirm={() => setStatus({ id: statusTarget.id, isActive: !statusTarget.isActive }).unwrap()}><strong>{statusTarget.email}</strong>{statusTarget.isActive ? ' will be signed out and unable to sign in. Their account details will be retained.' : ' will be able to sign in with the permissions of their assigned role.'}</ConfirmAction>}
  </AccessPage>;
}
