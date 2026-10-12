import { useState, type FormEvent } from 'react';
import { useSelector } from 'react-redux';
import { Building2, Clock3, ExternalLink, Mail, MapPin, MessageCircle, Phone, Plus } from 'lucide-react';
import type { RootState } from '../../app/store';
import { AccessPage, ConfirmAction, QueryFeedback, accessButton, accessInput, accessSecondary } from '../../components/AccessUi';
import CatalogDialog from '../../components/CatalogDialog';
import { catalogError } from '../../components/RepairServiceDialog';
import { hasPermission } from '../../features/auth/permissions';
import { useCreateBranchMutation, useDeleteBranchMutation, useGetBranchesQuery, useSetBranchStatusMutation, useUpdateBranchMutation, type Branch, type BranchInput } from '../../features/branches/branchesApi';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function optional(value: string) { return value.trim() || undefined; }

function BranchEditor({ branch, onClose }: { branch?: Branch; onClose: () => void }) {
  const [name, setName] = useState(branch?.name ?? '');
  const [code, setCode] = useState(branch?.code ?? '');
  const [location, setLocation] = useState(branch?.location ?? '');
  const [googleMapUrl, setGoogleMapUrl] = useState(branch?.googleMapUrl ?? '');
  const [openTime, setOpenTime] = useState(branch?.openTime ?? '09:00');
  const [closeTime, setCloseTime] = useState(branch?.closeTime ?? '18:00');
  const [is24Hours, setIs24Hours] = useState(branch?.is24Hours ?? false);
  const [weeklyOffDays, setWeeklyOffDays] = useState<string[]>(branch?.weeklyOffDays ?? []);
  const [contactNumber, setContactNumber] = useState(branch?.contactNumber ?? '');
  const [whatsappNumber, setWhatsappNumber] = useState(branch?.whatsappNumber ?? '');
  const [email, setEmail] = useState(branch?.email ?? '');
  const [managerName, setManagerName] = useState(branch?.managerName ?? '');
  const [note, setNote] = useState(branch?.note ?? '');
  const [error, setError] = useState<string | null>(null);
  const [createBranch, { isLoading: creating }] = useCreateBranchMutation();
  const [updateBranch, { isLoading: updating }] = useUpdateBranchMutation();
  const busy = creating || updating;
  const toggleOffDay = (day: string) => setWeeklyOffDays((current) => current.includes(day) ? current.filter((item) => item !== day) : [...current, day]);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    const body: BranchInput = {
      name: name.trim(), code: optional(code), location: location.trim(), googleMapUrl: optional(googleMapUrl),
      ...(is24Hours ? {} : { openTime, closeTime }), is24Hours, weeklyOffDays,
      contactNumber: contactNumber.trim(), whatsappNumber: optional(whatsappNumber), email: optional(email),
      managerName: optional(managerName), note: optional(note),
    };
    try {
      setError(null);
      if (branch) await updateBranch({ id: branch.id, ...body }).unwrap();
      else await createBranch(body).unwrap();
      onClose();
    } catch (failure) { setError(catalogError(failure)); }
  };
  return <CatalogDialog title={branch ? 'Edit branch' : 'Add branch'} onClose={() => !busy && onClose()}>
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700">Branch name *<input required maxLength={120} value={name} onChange={(event) => setName(event.target.value)} className={accessInput} placeholder="e.g. Dhanmondi Branch" /></label>
        <label className="block text-sm font-semibold text-slate-700">Branch code<input maxLength={30} pattern="[A-Za-z0-9][A-Za-z0-9_-]*" value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} className={accessInput} placeholder="e.g. DHK-01" /></label>
      </div>
      <label className="block text-sm font-semibold text-slate-700">Location / full address *<textarea required maxLength={500} rows={2} value={location} onChange={(event) => setLocation(event.target.value)} className={`${accessInput} h-auto py-3`} placeholder="Road, area, city, postal code" /></label>
      <label className="block text-sm font-semibold text-slate-700">Google Maps link<input type="url" maxLength={2048} value={googleMapUrl} onChange={(event) => setGoogleMapUrl(event.target.value)} className={accessInput} placeholder="https://maps.google.com/..." /></label>
      <fieldset className="rounded-lg border border-slate-200 p-4">
        <legend className="px-1 text-sm font-semibold text-slate-700">Operating hours</legend>
        <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={is24Hours} onChange={(event) => setIs24Hours(event.target.checked)} className="size-4 accent-clay" />Open 24 hours</label>
        {!is24Hours && <div className="mt-3 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700">Open time *<input type="time" required value={openTime} onChange={(event) => setOpenTime(event.target.value)} className={accessInput} /></label><label className="text-sm font-semibold text-slate-700">Close time *<input type="time" required value={closeTime} onChange={(event) => setCloseTime(event.target.value)} className={accessInput} /></label></div>}
        <p className="mt-2 text-xs text-muted">A closing time earlier than opening time is treated as an overnight shift.</p>
        <div className="mt-4"><p className="text-sm font-semibold text-slate-700">Weekly closed days</p><div className="mt-2 flex flex-wrap gap-2">{weekdays.map((day) => <label key={day} className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium ${weeklyOffDays.includes(day) ? 'border-clay bg-clay/10 text-clay-dark' : 'border-slate-200 text-slate-600'}`}><input type="checkbox" className="sr-only" checked={weeklyOffDays.includes(day)} onChange={() => toggleOffDay(day)} />{day.slice(0, 3)}</label>)}</div></div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700">Contact number *<input required type="tel" maxLength={25} pattern="\+?[0-9][0-9 ()-]{5,24}" value={contactNumber} onChange={(event) => setContactNumber(event.target.value)} className={accessInput} placeholder="+880 1XXX XXXXXX" /></label>
        <label className="block text-sm font-semibold text-slate-700">WhatsApp number<input type="tel" maxLength={25} pattern="\+?[0-9][0-9 ()-]{5,24}" value={whatsappNumber} onChange={(event) => setWhatsappNumber(event.target.value)} className={accessInput} placeholder="+880 1XXX XXXXXX" /></label>
        <label className="block text-sm font-semibold text-slate-700">Email<input type="email" maxLength={320} value={email} onChange={(event) => setEmail(event.target.value)} className={accessInput} placeholder="branch@example.com" /></label>
        <label className="block text-sm font-semibold text-slate-700">Manager / contact person<input maxLength={100} value={managerName} onChange={(event) => setManagerName(event.target.value)} className={accessInput} /></label>
      </div>
      <label className="block text-sm font-semibold text-slate-700">Note<textarea maxLength={5000} rows={3} value={note} onChange={(event) => setNote(event.target.value)} className={`${accessInput} h-auto py-3`} placeholder="Parking, directions, special instructions, etc." /></label>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4"><button type="button" disabled={busy} onClick={onClose} className={accessSecondary}>Cancel</button><button type="submit" disabled={busy} className={accessButton}>{busy ? 'Saving…' : branch ? 'Save changes' : 'Add branch'}</button></div>
    </form>
  </CatalogDialog>;
}

function schedule(branch: Branch) {
  if (branch.is24Hours) return 'Open 24 hours';
  return `${branch.openTime ?? '—'} – ${branch.closeTime ?? '—'}`;
}

export default function Branches() {
  const actor = useSelector((state: RootState) => state.auth.user);
  const { data: branches = [], isLoading, isError, refetch } = useGetBranchesQuery();
  const [setBranchStatus] = useSetBranchStatusMutation();
  const [deleteBranch] = useDeleteBranchMutation();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [editor, setEditor] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [statusTarget, setStatusTarget] = useState<Branch | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Branch | null>(null);
  const query = search.trim().toLowerCase();
  const filtered = branches.filter((branch) => `${branch.name} ${branch.code ?? ''} ${branch.location} ${branch.contactNumber}`.toLowerCase().includes(query) && (status === 'all' || branch.isActive === (status === 'active')));
  return <AccessPage title="Branches" description="Manage every business location, its operating hours, contact details, availability, and directions." action={hasPermission(actor, 'branches.create') && <button type="button" onClick={() => { setEditingBranch(null); setEditor(true); }} className={accessButton}><Plus size={17} />Add branch</button>}>
    <div className="flex flex-wrap gap-3"><input aria-label="Search branches" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, code, location, or phone" className={`${accessInput} !mt-0 min-w-64 flex-1`} /><select aria-label="Branch status" value={status} onChange={(event) => setStatus(event.target.value)} className={`${accessInput} !mt-0 !w-auto`}><option value="all">All branches</option><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
    <QueryFeedback loading={isLoading} failed={isError} retry={() => void refetch()} empty={!filtered.length ? 'No matching branches.' : undefined} />
    {!isLoading && !isError && filtered.length > 0 && <div className="grid gap-4 lg:grid-cols-2">{filtered.map((branch) => <article key={branch.id} className={`rounded-xl border p-4 ${branch.isActive ? 'border-border bg-white' : 'border-slate-200 bg-slate-50'}`}>
      <div className="flex items-start justify-between gap-3"><div className="flex min-w-0 gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-clay/10 text-clay"><Building2 size={20} /></span><div className="min-w-0"><h2 className="font-semibold text-foreground">{branch.name}</h2><div className="mt-1 flex flex-wrap items-center gap-2"><span className={`rounded-full px-2 py-0.5 text-xs ${branch.isActive ? 'bg-green-50 text-green-700' : 'bg-slate-200 text-slate-600'}`}>{branch.isActive ? 'Active' : 'Inactive'}</span>{branch.code && <span className="text-xs text-muted">{branch.code}</span>}</div></div></div></div>
      <div className="mt-4 space-y-2 text-sm text-slate-600"><p className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0" /><span>{branch.location}{branch.googleMapUrl && <> · <a href={branch.googleMapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-clay hover:underline">Map <ExternalLink size={12} /></a></>}</span></p><p className="flex items-center gap-2"><Clock3 size={16} className="shrink-0" /><span>{schedule(branch)}{branch.weeklyOffDays.length > 0 && ` · Closed ${branch.weeklyOffDays.join(', ')}`}</span></p><p className="flex items-center gap-2"><Phone size={16} className="shrink-0" /><a href={`tel:${branch.contactNumber}`} className="hover:text-clay">{branch.contactNumber}</a></p>{branch.whatsappNumber && <p className="flex items-center gap-2"><MessageCircle size={16} className="shrink-0" /><a href={`https://wa.me/${branch.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="hover:text-clay">{branch.whatsappNumber}</a></p>}{branch.email && <p className="flex items-center gap-2"><Mail size={16} className="shrink-0" /><a href={`mailto:${branch.email}`} className="truncate hover:text-clay">{branch.email}</a></p>}{branch.managerName && <p><span className="font-medium text-slate-700">Manager:</span> {branch.managerName}</p>}{branch.note && <p className="rounded-lg bg-slate-50 p-3 text-xs leading-relaxed">{branch.note}</p>}</div>
      <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-3">{hasPermission(actor, 'branches.update') && <button type="button" onClick={() => { setEditingBranch(branch); setEditor(true); }} className={accessSecondary}>Edit</button>}{hasPermission(actor, 'branches.status') && <button type="button" onClick={() => setStatusTarget(branch)} className={accessSecondary}>{branch.isActive ? 'Set inactive' : 'Activate'}</button>}{hasPermission(actor, 'branches.delete') && <button type="button" onClick={() => setDeleteTarget(branch)} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Delete</button>}</div>
    </article>)}</div>}
    {editor && <BranchEditor branch={editingBranch ?? undefined} onClose={() => setEditor(false)} />}
    {statusTarget && <ConfirmAction title={`${statusTarget.isActive ? 'Set branch inactive' : 'Activate branch'}?`} confirmLabel={statusTarget.isActive ? 'Set inactive' : 'Activate branch'} onClose={() => setStatusTarget(null)} onConfirm={() => setBranchStatus({ id: statusTarget.id, isActive: !statusTarget.isActive }).unwrap()}><strong>{statusTarget.name}</strong>{statusTarget.isActive ? ' will be retained but marked unavailable. You can activate it again later.' : ' will be marked active and available for operations.'}</ConfirmAction>}
    {deleteTarget && <ConfirmAction title="Permanently delete branch?" confirmLabel="Delete branch" onClose={() => setDeleteTarget(null)} onConfirm={() => deleteBranch(deleteTarget.id).unwrap()}>This permanently removes <strong>{deleteTarget.name}</strong> and cannot be undone. Use inactive instead if the branch may reopen later.</ConfirmAction>}
  </AccessPage>;
}
