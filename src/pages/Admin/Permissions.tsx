import { useState, type FormEvent } from 'react';
import { useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import type { RootState } from '../../app/store';
import { hasPermission } from '../../features/auth/permissions';
import { useCreatePermissionMutation, useDeletePermissionMutation, useGetPermissionsQuery, useUpdatePermissionMutation, type Permission } from '../../features/access/accessApi';
import CatalogDialog from '../../components/CatalogDialog';
import { catalogError } from '../../components/RepairServiceDialog';
import { AccessPage, ConfirmAction, QueryFeedback, accessButton, accessInput, accessSecondary } from '../../components/AccessUi';

function PermissionEditor({ permission, onClose }: { permission?: Permission; onClose: () => void }) {
  const [name, setName] = useState(permission?.name ?? '');
  const [key, setKey] = useState(permission?.key ?? '');
  const [group, setGroup] = useState(permission?.group ?? 'Custom');
  const [description, setDescription] = useState(permission?.description ?? '');
  const [error, setError] = useState<string | null>(null);
  const [createPermission, { isLoading: creating }] = useCreatePermissionMutation();
  const [updatePermission, { isLoading: updating }] = useUpdatePermissionMutation();
  const busy = creating || updating;
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    try {
      setError(null);
      const body = { name: name.trim(), group: group.trim(), description: description.trim() };
      if (permission) await updatePermission({ id: permission.id, ...body }).unwrap();
      else await createPermission({ key: key.trim().toLowerCase(), ...body }).unwrap();
      onClose();
    } catch (failure) { setError(catalogError(failure)); }
  };
  return <CatalogDialog title={permission ? 'Edit permission' : 'Add permission'} onClose={() => !busy && onClose()}>
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm font-semibold text-slate-700">Permission name *<input required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} className={accessInput} placeholder="e.g. Export reports" /></label>
      <label className="block text-sm font-semibold text-slate-700">Permission key *<input required disabled={Boolean(permission)} maxLength={100} pattern="[a-z][a-z0-9_\-]*(\.[a-z][a-z0-9_\-]*)+" value={key} onChange={(event) => setKey(event.target.value.toLowerCase())} className={accessInput} placeholder="e.g. reports.export" /></label>
      <p className="text-xs text-muted">Keys stay fixed after creation. A custom permission controls a feature when that feature checks its key.</p>
      <label className="block text-sm font-semibold text-slate-700">Group *<input required maxLength={100} value={group} onChange={(event) => setGroup(event.target.value)} className={accessInput} placeholder="e.g. Reports" /></label>
      <label className="block text-sm font-semibold text-slate-700">Description<input maxLength={500} value={description} onChange={(event) => setDescription(event.target.value)} className={accessInput} placeholder="What does this permission allow?" /></label>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4"><button type="button" disabled={busy} onClick={onClose} className={accessSecondary}>Cancel</button><button type="submit" disabled={busy} className={accessButton}>{busy ? 'Saving…' : permission ? 'Save changes' : 'Add permission'}</button></div>
    </form>
  </CatalogDialog>;
}

export default function Permissions() {
  const actor = useSelector((state: RootState) => state.auth.user);
  const { data: permissions = [], isLoading, isError, refetch } = useGetPermissionsQuery();
  const [deletePermission] = useDeletePermissionMutation();
  const [search, setSearch] = useState('');
  const [editor, setEditor] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Permission | null>(null);
  const filtered = permissions.filter((permission) => `${permission.name} ${permission.key} ${permission.group}`.toLowerCase().includes(search.toLowerCase()));
  return <AccessPage title="Permissions" description="Manage action permissions here, then assign them from the Roles page. Built-in permissions control the existing dashboard features." action={hasPermission(actor, 'permissions.create') && <button type="button" onClick={() => { setEditingPermission(null); setEditor(true); }} className={accessButton}><Plus size={17} />Add permission</button>}>
    <input aria-label="Search permissions" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search permissions or groups" className={`${accessInput} !mt-0 max-w-md`} />
    <QueryFeedback loading={isLoading} failed={isError} retry={() => void refetch()} empty={!filtered.length ? 'No matching permissions.' : undefined} />
    {!isLoading && !isError && filtered.length > 0 && <div className="divide-y divide-border rounded-lg border border-border">{filtered.map((permission) => <article key={permission.id} className="flex flex-wrap items-center justify-between gap-3 p-4"><div><h2 className="font-semibold text-foreground">{permission.name} <span className="ml-1 text-xs font-normal text-muted">{permission.isSystem ? 'Built-in' : 'Custom'}</span></h2><p className="text-sm text-muted">{permission.group} · {permission.key}</p>{permission.description && <p className="mt-1 text-sm text-muted">{permission.description}</p>}</div><div className="flex gap-2">{hasPermission(actor, 'permissions.update') && <button type="button" onClick={() => { setEditingPermission(permission); setEditor(true); }} className={accessSecondary}>Edit</button>}{!permission.isSystem && hasPermission(actor, 'permissions.delete') && <button type="button" onClick={() => setDeleteTarget(permission)} className={accessSecondary}>Remove</button>}</div></article>)}</div>}
    {editor && <PermissionEditor permission={editingPermission ?? undefined} onClose={() => setEditor(false)} />}
    {deleteTarget && <ConfirmAction title="Remove permission?" confirmLabel="Remove permission" onClose={() => setDeleteTarget(null)} onConfirm={() => deletePermission(deleteTarget.id).unwrap()}>Remove <strong>{deleteTarget.name}</strong>? Unassign it from all roles first.</ConfirmAction>}
  </AccessPage>;
}
