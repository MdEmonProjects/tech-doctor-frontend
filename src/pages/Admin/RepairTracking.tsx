import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Eye, Pencil, RefreshCw, Search, SearchX } from 'lucide-react';
import type { RootState } from '../../app/store';
import { AccessPage, QueryFeedback, accessInput } from '../../components/AccessUi';
import RepairStatusDialog, { REPAIR_STATUS_THEME } from '../../components/RepairStatusDialog';
import { hasPermission } from '../../features/auth/permissions';
import { REPAIR_STATUSES, REPAIR_STATUS_LABELS, useGetRepairsQuery, type RepairStatus, type RepairTicket } from '../../features/repairs/repairsApi';

type RepairFilter = 'ALL' | RepairStatus;
const FILTERS: RepairFilter[] = ['ALL', ...REPAIR_STATUSES];

export default function RepairTracking() {
  const actor = useSelector((state: RootState) => state.auth.user);
  const { data: repairs = [], isLoading, isError, refetch } = useGetRepairsQuery();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<RepairFilter>('ALL');
  const [statusTarget, setStatusTarget] = useState<RepairTicket | null>(null);
  const canUpdateStatus = hasPermission(actor, 'repairs.status');
  const canEdit = hasPermission(actor, 'repairs.update');

  const counts = useMemo(() => {
    const result = {} as Record<RepairStatus, number>;
    REPAIR_STATUSES.forEach((entry) => { result[entry] = 0; });
    repairs.forEach((repair) => { result[repair.status] += 1; });
    return result;
  }, [repairs]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return repairs.filter((repair) => (
      (status === 'ALL' || repair.status === status)
      && `${repair.customerName} ${repair.ticketId} ${repair.phone ?? ''} ${repair.brand} ${repair.model} ${repair.service}`.toLowerCase().includes(query)
    ));
  }, [repairs, search, status]);

  return <AccessPage title="Repair Tracking" description="Open a status queue, find a repair, and manage it from one focused workspace.">
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_32px_-28px_rgba(15,23,42,0.5)]">
      <div role="tablist" aria-label="Repair status queues" className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-slate-50/70 p-2 [scrollbar-width:thin]">
        {FILTERS.map((entry) => {
          const selected = status === entry;
          const label = entry === 'ALL' ? 'All repairs' : REPAIR_STATUS_LABELS[entry];
          const count = entry === 'ALL' ? repairs.length : counts[entry];
          const activeClass = entry === 'ALL' ? 'border-slate-900 bg-slate-900 text-white' : REPAIR_STATUS_THEME[entry].selected;
          return <button key={entry} type="button" role="tab" aria-selected={selected} onClick={() => setStatus(entry)} className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition ${selected ? activeClass : 'border-transparent text-slate-500 hover:border-slate-200 hover:bg-white hover:text-slate-800'}`}>
            {entry !== 'ALL' && <span className={`h-2 w-2 rounded-full ${REPAIR_STATUS_THEME[entry].dot}`} />}{label}<span className={`rounded-md px-1.5 py-0.5 text-[11px] tabular-nums ${selected ? 'bg-white/60' : 'bg-slate-200/70'}`}>{count}</span>
          </button>;
        })}
      </div>
      <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative min-w-0 flex-1 sm:max-w-lg"><Search size={17} className="absolute left-3.5 top-3 text-slate-400" /><input aria-label="Search repairs" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, ticket, phone, brand, model or damage" className={`${accessInput} !mt-0 border-slate-200 pl-10`} /></label>
        <p className="text-sm text-slate-500"><span className="font-bold tabular-nums text-slate-900">{filtered.length}</span> {filtered.length === 1 ? 'repair' : 'repairs'} in this list</p>
      </div>
    </div>

    <QueryFeedback loading={isLoading} failed={isError} retry={() => void refetch()} />

    {!isLoading && !isError && filtered.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 py-12 text-center"><SearchX className="mx-auto text-slate-400" /><p className="mt-3 font-semibold text-slate-800">No matching repairs</p><p className="mt-1 text-sm text-slate-500">Try a different status or search term.</p></div>}

    {!isLoading && !isError && filtered.length > 0 && <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-[0_12px_35px_-30px_rgba(15,23,42,0.55)]">
      <table className="min-w-[1050px] w-full text-sm">
        <thead className="border-b border-slate-200 bg-slate-50/90 text-left text-xs font-bold uppercase tracking-wider text-slate-500"><tr><th className="w-16 px-4 py-3.5 text-center">SL</th><th className="px-4 py-3.5">Name</th><th className="px-4 py-3.5">Number</th><th className="px-4 py-3.5">Phone</th><th className="px-4 py-3.5">Brand</th><th className="px-4 py-3.5">Model</th><th className="px-4 py-3.5">Damage type</th><th className="px-4 py-3.5 text-right">Action</th></tr></thead>
        <tbody className="divide-y divide-slate-100">{filtered.map((repair, index) => <tr key={repair.id} className="transition hover:bg-[#fffaf7]">
          <td className="px-4 py-4 text-center font-medium tabular-nums text-slate-400">{index + 1}</td>
          <td className="px-4 py-4 font-semibold text-slate-800">{repair.customerName}</td>
          <td className="px-4 py-4 font-mono font-bold text-clay">{repair.ticketId}</td>
          <td className="px-4 py-4"><a href={`tel:${repair.phone}`} className="text-slate-600 hover:text-clay">{repair.phone ?? '—'}</a></td>
          <td className="px-4 py-4 text-slate-600">{repair.brand}</td>
          <td className="px-4 py-4 text-slate-600">{repair.model}</td>
          <td className="px-4 py-4"><span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-700">{repair.service}</span></td>
          <td className="px-4 py-4"><div className="flex justify-end gap-2">
            <Link aria-label={`View ${repair.ticketId}`} to={`/dashboard/repair-service/repair-tracking/${repair.id}`} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-clay/40 hover:bg-clay/5 hover:text-clay"><Eye size={14} />View</Link>
            {canUpdateStatus && <button aria-label={`Update status for ${repair.ticketId}`} type="button" onClick={() => setStatusTarget(repair)} className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"><RefreshCw size={14} />Status</button>}
            {canEdit && <Link aria-label={`Edit ${repair.ticketId}`} to={`/dashboard/repair-service/repair-tracking/${repair.id}?panel=edit`} className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"><Pencil size={14} />Edit</Link>}
          </div></td>
        </tr>)}</tbody>
      </table>
    </div>}

    {statusTarget && <RepairStatusDialog repair={statusTarget} onClose={() => setStatusTarget(null)} />}
  </AccessPage>;
}
