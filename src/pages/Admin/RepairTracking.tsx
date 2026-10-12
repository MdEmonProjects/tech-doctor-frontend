import { useMemo, useState, type FormEvent } from 'react';
import { useSelector } from 'react-redux';
import { Clock3, MapPin, Phone, Search, Smartphone } from 'lucide-react';
import type { RootState } from '../../app/store';
import { AccessPage, QueryFeedback, accessButton, accessInput, accessSecondary } from '../../components/AccessUi';
import CatalogDialog from '../../components/CatalogDialog';
import { catalogError } from '../../components/RepairServiceDialog';
import { hasPermission } from '../../features/auth/permissions';
import { REPAIR_STATUSES, REPAIR_STATUS_LABELS, useGetRepairsQuery, useUpdateRepairStatusMutation, type RepairStatus, type RepairTicket } from '../../features/repairs/repairsApi';

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function toLocalInput(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function StatusEditor({ repair, onClose }: { repair: RepairTicket; onClose: () => void }) {
  const [status, setStatus] = useState<RepairStatus>(repair.status);
  const [note, setNote] = useState(repair.statusNote ?? '');
  const [estimatedCompletion, setEstimatedCompletion] = useState(toLocalInput(repair.estimatedCompletion));
  const [error, setError] = useState<string | null>(null);
  const [updateStatus, { isLoading }] = useUpdateRepairStatusMutation();
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setError(null);
      await updateStatus({ id: repair.id, status, note: note.trim() || undefined, estimatedCompletion: estimatedCompletion ? new Date(estimatedCompletion).toISOString() : undefined }).unwrap();
      onClose();
    } catch (failure) { setError(catalogError(failure)); }
  };
  return <CatalogDialog title={`Update ${repair.ticketId}`} onClose={() => !isLoading && onClose()}>
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm font-semibold text-slate-700">Status *<select required value={status} onChange={(event) => setStatus(event.target.value as RepairStatus)} className={accessInput}>{REPAIR_STATUSES.map((entry) => <option key={entry} value={entry}>{REPAIR_STATUS_LABELS[entry]}</option>)}</select></label>
      <label className="block text-sm font-semibold text-slate-700">Customer update<textarea maxLength={5000} rows={4} value={note} onChange={(event) => setNote(event.target.value)} className={`${accessInput} h-auto py-3`} placeholder="Tell the customer what changed or what happens next." /></label>
      <label className="block text-sm font-semibold text-slate-700">Estimated completion<input type="datetime-local" value={estimatedCompletion} onChange={(event) => setEstimatedCompletion(event.target.value)} className={accessInput} /></label>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4"><button type="button" disabled={isLoading} onClick={onClose} className={accessSecondary}>Cancel</button><button type="submit" disabled={isLoading} className={accessButton}>{isLoading ? 'Saving…' : 'Add status update'}</button></div>
    </form>
  </CatalogDialog>;
}

export default function RepairTracking() {
  const actor = useSelector((state: RootState) => state.auth.user);
  const { data: repairs = [], isLoading, isError, refetch } = useGetRepairsQuery();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [editing, setEditing] = useState<RepairTicket | null>(null);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return repairs.filter((repair) => (status === 'ALL' || repair.status === status) && `${repair.ticketId} ${repair.customerName} ${repair.phone ?? ''} ${repair.brand} ${repair.model} ${repair.service} ${repair.branch?.name ?? ''}`.toLowerCase().includes(query));
  }, [repairs, search, status]);

  return <AccessPage title="Repair Tracking" description="Review submitted repair requests and publish status updates that customers can see on the tracking page.">
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
      <label className="relative"><Search size={17} className="absolute left-3 top-3.5 text-slate-400" /><input aria-label="Search repairs" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Ticket, customer, phone, device or branch" className={`${accessInput} !mt-0 pl-10`} /></label>
      <select aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value)} className={`${accessInput} !mt-0`}><option value="ALL">All statuses</option>{REPAIR_STATUSES.map((entry) => <option key={entry} value={entry}>{REPAIR_STATUS_LABELS[entry]}</option>)}</select>
    </div>
    <QueryFeedback loading={isLoading} failed={isError} retry={() => void refetch()} empty={!filtered.length ? 'No matching repair requests.' : undefined} />
    {!isLoading && !isError && filtered.length > 0 && <div className="space-y-3">{filtered.map((repair) => <article key={repair.id} className="rounded-xl border border-border bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-mono font-bold text-clay">{repair.ticketId}</h2><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${repair.status === 'CANCELLED' ? 'bg-red-50 text-red-700' : repair.status === 'COMPLETED' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{REPAIR_STATUS_LABELS[repair.status]}</span></div><p className="mt-1 font-semibold text-foreground">{repair.customerName}</p></div>{hasPermission(actor, 'repairs.status') && <button type="button" onClick={() => setEditing(repair)} className={accessButton}>Add status</button>}</div>
      <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4"><p className="flex items-center gap-2"><Smartphone size={16} /><span>{repair.brand} {repair.model}</span></p><p className="flex items-center gap-2"><Phone size={16} /><a href={`tel:${repair.phone}`}>{repair.phone}</a></p><p className="flex items-center gap-2"><MapPin size={16} /><span>{repair.branch?.name ?? 'No branch assigned'}</span></p><p className="flex items-center gap-2"><Clock3 size={16} /><span>{formatDate(repair.createdAt)}</span></p></div>
      <p className="mt-3 text-sm"><span className="font-semibold text-slate-700">Service:</span> <span className="text-slate-600">{repair.service}</span></p>{repair.statusNote && <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">{repair.statusNote}</p>}
      {(repair.serviceMode || repair.preferredDate || repair.preferredTime) && <p className="mt-2 text-sm text-slate-600"><span className="font-semibold text-slate-700">Requested:</span> {[repair.serviceMode?.replace('-', ' '), repair.preferredDate, repair.preferredTime].filter(Boolean).join(' · ')}</p>}
      {repair.customerNotes && <p className="mt-2 text-sm text-slate-600"><span className="font-semibold text-slate-700">Customer note:</span> {repair.customerNotes}</p>}
      <details className="mt-3 text-sm"><summary className="cursor-pointer font-medium text-clay">{repair.history.length} status update{repair.history.length === 1 ? '' : 's'}</summary><ol className="mt-2 space-y-2 border-l-2 border-slate-100 pl-4">{[...repair.history].reverse().map((entry) => <li key={entry.id}><span className="font-medium text-slate-700">{REPAIR_STATUS_LABELS[entry.status]}</span><span className="ml-2 text-xs text-muted">{formatDate(entry.createdAt)}</span>{entry.note && <p className="text-slate-600">{entry.note}</p>}</li>)}</ol></details>
    </article>)}</div>}
    {editing && <StatusEditor repair={editing} onClose={() => setEditing(null)} />}
  </AccessPage>;
}
