import { useState, type FormEvent } from 'react';
import { useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import type { RootState } from '../../app/store';
import { hasPermission } from '../../features/auth/permissions';
import { useCreateRoleMutation, useDeleteRoleMutation, useGetRolePermissionsQuery, useGetRolesQuery, useUpdateRoleMutation, type AccessRole, type Permission } from '../../features/access/accessApi';
import CatalogDialog from '../../components/CatalogDialog';
import { catalogError } from '../../components/RepairServiceDialog';
import { AccessPage, ConfirmAction, QueryFeedback, accessButton, accessInput, accessSecondary } from '../../components/AccessUi';

function RoleEditor({ role, permissions, onClose }: { role?: AccessRole; permissions: Permission[]; onClose: () => void }) {
  const [name, setName] = useState(role?.name ?? '');
  const [key, setKey] = useState(role?.key ?? '');
  const [description, setDescription] = useState(role?.description ?? '');
  const [selected, setSelected] = useState<Set<number>>(() => new Set(role?.permissions.map((entry) => entry.permissionId) ?? []));
  const [error, setError] = useState<string | null>(null);
  const [createRole, { isLoading: creating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: updating }] = useUpdateRoleMutation();
  const busy = creating || updating;
  const groups = [...new Set(permissions.map((permission) => permission.group))];
  const toggle = (permission: Permission) => setSelected((current) => {
    const next = new Set(current);
    const scope = permission.key.split('.')[0];
    if (next.has(permission.id)) {
      next.delete(permission.id);
      if (permission.isSystem && permission.key === `${scope}.view`) permissions.filter((entry) => entry.isSystem && entry.key.startsWith(`${scope}.`)).forEach((entry) => next.delete(entry.id));
    } else {
      next.add(permission.id);
      const view = permissions.find((entry) => entry.isSystem && entry.key === `${scope}.view`);
      if (view) next.add(view.id);
    }
    return next;
  });
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    try {
      setError(null);
      const body = { name: name.trim(), description: description.trim(), permissionIds: [...selected] };
      if (role) await updateRole({ id: role.id, ...body }).unwrap();
      else await createRole({ key: key.trim().toUpperCase(), ...body }).unwrap();
      onClose();
    } catch (failure) { setError(catalogError(failure)); }
  };
  return <CatalogDialog title={role ? 'Edit role and permissions' : 'Add role'} onClose={() => !busy && onClose()}>
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm font-semibold text-slate-700">Role name *<input required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} className={accessInput} placeholder="e.g. Repair technician" /></label>
      <label className="block text-sm font-semibold text-slate-700">Role key *<input required disabled={Boolean(role)} pattern="[A-Z][A-Z0-9_]*" maxLength={50} value={key} onChange={(event) => setKey(event.target.value.toUpperCase())} className={accessInput} placeholder="e.g. TECHNICIAN" /></label>
      <label className="block text-sm font-semibold text-slate-700">Description<input maxLength={500} value={description} onChange={(event) => setDescription(event.target.value)} className={accessInput} /></label>
      <div><h3 className="text-sm font-semibold text-slate-700">Allowed actions</h3><p className="mb-3 mt-1 text-xs text-muted">Selecting an action also enables the page's View permission. Everyone assigned to this role receives these permissions.</p>
        <div className="max-h-72 space-y-3 overflow-y-auto rounded-lg border border-slate-200 p-3">{groups.map((group) => <fieldset key={group} className="space-y-2 rounded-lg bg-slate-50 p-3"><legend className="px-1 text-sm font-semibold text-slate-800">{group}</legend>{permissions.filter((permission) => permission.group === group).map((permission) => <label key={permission.id} className="flex cursor-pointer items-start gap-2 text-sm text-slate-700"><input type="checkbox" checked={selected.has(permission.id)} onChange={() => toggle(permission)} className="mt-0.5 size-4 shrink-0 accent-clay" /><span>{permission.name}{permission.description && <span className="block text-xs text-muted">{permission.description}</span>}</span></label>)}</fieldset>)}</div>
        <p className="mt-2 text-xs text-muted">{selected.size} permissions selected</p>
      </div>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4"><button type="button" disabled={busy} onClick={onClose} className={accessSecondary}>Cancel</button><button type="submit" disabled={busy} className={accessButton}>{busy ? 'Saving…' : role ? 'Save permissions' : 'Add role'}</button></div>
    </form>
  </CatalogDialog>;
}

export default function Roles() {
  const actor = useSelector((state: RootState) => state.auth.user);
  const { data: roles = [], isLoading, isError, refetch } = useGetRolesQuery();
  const { data: permissions = [], isLoading: permissionsLoading, isError: permissionsError, refetch: refetchPermissions } = useGetRolePermissionsQuery();
  const [deleteRole] = useDeleteRoleMutation();
  const [search, setSearch] = useState('');
  const [editor, setEditor] = useState(false);
  const [editingRole, setEditingRole] = useState<AccessRole | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AccessRole | null>(null);
  const filtered = roles.filter((role) => `${role.name} ${role.key}`.toLowerCase().includes(search.toLowerCase()));
  const mayManage = (role: AccessRole) => actor?.role === 'ADMIN' || role.permissions.every((entry) => hasPermission(actor, entry.permission.key));
  return <AccessPage title="Roles" description="Choose exactly which dashboard actions each role can perform. Changes apply to all users assigned to that role." action={hasPermission(actor, 'roles.create') && <button type="button" disabled={permissionsLoading || permissionsError} onClick={() => { setEditingRole(null); setEditor(true); }} className={accessButton}><Plus size={17} />Add role</button>}>
    <input aria-label="Search roles" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search roles" className={`${accessInput} !mt-0 max-w-md`} />
    {permissionsError && <p role="alert" className="text-sm text-red-600">Permission choices could not be loaded. <button type="button" onClick={() => void refetchPermissions()} className="underline">Try again</button></p>}
    <QueryFeedback loading={isLoading} failed={isError} retry={() => void refetch()} empty={!filtered.length ? 'No matching roles.' : undefined} />
    {!isLoading && !isError && filtered.length > 0 && <div className="divide-y divide-border rounded-lg border border-border">{filtered.map((role) => <article key={role.id} className="flex flex-wrap items-start justify-between gap-4 p-4"><div className="min-w-0 flex-1"><h2 className="font-semibold text-foreground">{role.name} {role.isSystem && <span className="ml-1 text-xs font-normal text-muted">Built-in</span>}</h2><p className="text-sm text-muted">{role.key} · {role._count.users} users</p>{role.description && <p className="mt-1 text-sm text-muted">{role.description}</p>}{role.key === 'ADMIN' ? <p className="mt-2 text-sm text-clay">All permissions, including future permissions.</p> : <details className="mt-2 text-sm"><summary className="cursor-pointer font-medium text-clay">{role.permissions.length} allowed actions</summary><ul className="mt-2 space-y-1 text-muted">{role.permissions.map((entry) => <li key={entry.permissionId}>{entry.permission.name}</li>)}</ul></details>}</div><div className="flex gap-2">{role.key !== 'ADMIN' && actor?.roleId !== role.id && mayManage(role) && hasPermission(actor, 'roles.update') && <button type="button" disabled={permissionsLoading || permissionsError} onClick={() => { setEditingRole(role); setEditor(true); }} className={accessSecondary}>Edit permissions</button>}{!role.isSystem && mayManage(role) && hasPermission(actor, 'roles.delete') && <button type="button" disabled={role._count.users > 0} title={role._count.users ? 'Reassign its users before removing this role.' : undefined} onClick={() => setDeleteTarget(role)} className={accessSecondary}>Remove</button>}</div></article>)}</div>}
    {editor && <RoleEditor role={editingRole ?? undefined} permissions={permissions} onClose={() => setEditor(false)} />}
    {deleteTarget && <ConfirmAction title="Remove role?" confirmLabel="Remove role" onClose={() => setDeleteTarget(null)} onConfirm={() => deleteRole(deleteTarget.id).unwrap()}>Remove <strong>{deleteTarget.name}</strong>? A role can be removed only when no users are assigned to it.</ConfirmAction>}
  </AccessPage>;
}
