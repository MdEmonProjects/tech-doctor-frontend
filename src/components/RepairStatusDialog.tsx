import { useState, type FormEvent } from 'react';
import { Check, RefreshCw } from 'lucide-react';
import { accessButton, accessInput, accessSecondary } from './AccessUi';
import CatalogDialog from './CatalogDialog';
import { catalogError } from './RepairServiceDialog';
import { REPAIR_STATUSES, REPAIR_STATUS_LABELS, useUpdateRepairStatusMutation, type RepairStatus, type RepairTicket } from '../features/repairs/repairsApi';

export const REPAIR_STATUS_THEME: Record<RepairStatus, { dot: string; badge: string; selected: string }> = {
  PENDING: { dot: 'bg-amber-500', badge: 'border-amber-200 bg-amber-50 text-amber-800', selected: 'border-amber-300 bg-amber-50 text-amber-900' },
  CONFIRMED: { dot: 'bg-blue-500', badge: 'border-blue-200 bg-blue-50 text-blue-800', selected: 'border-blue-300 bg-blue-50 text-blue-900' },
  DIAGNOSING: { dot: 'bg-violet-500', badge: 'border-violet-200 bg-violet-50 text-violet-800', selected: 'border-violet-300 bg-violet-50 text-violet-900' },
  IN_REPAIR: { dot: 'bg-orange-500', badge: 'border-orange-200 bg-orange-50 text-orange-800', selected: 'border-orange-300 bg-orange-50 text-orange-900' },
  QUALITY_CHECK: { dot: 'bg-cyan-500', badge: 'border-cyan-200 bg-cyan-50 text-cyan-800', selected: 'border-cyan-300 bg-cyan-50 text-cyan-900' },
  READY_FOR_PICKUP: { dot: 'bg-emerald-500', badge: 'border-emerald-200 bg-emerald-50 text-emerald-800', selected: 'border-emerald-300 bg-emerald-50 text-emerald-900' },
  COMPLETED: { dot: 'bg-green-600', badge: 'border-green-200 bg-green-50 text-green-800', selected: 'border-green-300 bg-green-50 text-green-900' },
  CANCELLED: { dot: 'bg-rose-500', badge: 'border-rose-200 bg-rose-50 text-rose-800', selected: 'border-rose-300 bg-rose-50 text-rose-900' },
};

export function RepairStatusBadge({ status }: { status: RepairStatus }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${REPAIR_STATUS_THEME[status].badge}`}><span className={`h-1.5 w-1.5 rounded-full ${REPAIR_STATUS_THEME[status].dot}`} />{REPAIR_STATUS_LABELS[status]}</span>;
}

function toLocalInput(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function RepairStatusDialog({ repair, onClose }: { repair: RepairTicket; onClose: () => void }) {
  const [status, setStatus] = useState<RepairStatus>(repair.status);
  const [note, setNote] = useState('');
  const [estimatedCompletion, setEstimatedCompletion] = useState(toLocalInput(repair.estimatedCompletion));
  const [error, setError] = useState<string | null>(null);
  const [updateStatus, { isLoading }] = useUpdateRepairStatusMutation();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setError(null);
      await updateStatus({ id: repair.id, status, note: note.trim() || undefined, estimatedCompletion: estimatedCompletion ? new Date(estimatedCompletion).toISOString() : undefined }).unwrap();
      onClose();
    } catch (failure) {
      setError(catalogError(failure));
    }
  };

  return <CatalogDialog title="Update repair status" onClose={() => !isLoading && onClose()}>
    <form onSubmit={submit} className="space-y-5">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <div className="min-w-0"><p className="font-mono text-sm font-bold text-clay">{repair.ticketId}</p><p className="truncate text-sm font-semibold text-slate-800">{repair.customerName} · {repair.brand} {repair.model}</p></div>
        <RepairStatusBadge status={repair.status} />
      </div>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-slate-700">New status *</legend>
        <div className="grid grid-cols-2 gap-2">{REPAIR_STATUSES.map((entry) => {
          const selected = status === entry;
          return <label key={entry} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${selected ? REPAIR_STATUS_THEME[entry].selected : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}><input type="radio" name="repair-status" value={entry} checked={selected} onChange={() => setStatus(entry)} className="sr-only" /><span className={`h-2 w-2 rounded-full ${REPAIR_STATUS_THEME[entry].dot}`} /><span className="min-w-0 flex-1">{REPAIR_STATUS_LABELS[entry]}</span>{selected && <Check size={15} />}</label>;
        })}</div>
      </fieldset>
      <label className="block text-sm font-semibold text-slate-700">Customer update<textarea maxLength={5000} rows={4} value={note} onChange={(event) => setNote(event.target.value)} className={`${accessInput} h-auto py-3`} placeholder="What changed and what happens next?" /><span className="mt-1 block text-right text-xs font-normal text-slate-400">{note.length}/5000</span></label>
      <label className="block text-sm font-semibold text-slate-700">Estimated completion<input type="datetime-local" value={estimatedCompletion} onChange={(event) => setEstimatedCompletion(event.target.value)} className={accessInput} /></label>
      {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4"><button type="button" disabled={isLoading} onClick={onClose} className={accessSecondary}>Cancel</button><button type="submit" disabled={isLoading} className={accessButton}><RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />{isLoading ? 'Saving…' : 'Save status'}</button></div>
    </form>
  </CatalogDialog>;
}
