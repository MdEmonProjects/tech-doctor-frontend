import { useState, type FormEvent } from 'react';
import { AlertCircle, CheckCircle2, Clock3, MapPin, Search, Smartphone, Wrench } from 'lucide-react';
import { useLazyTrackRepairQuery, REPAIR_STATUS_LABELS, type RepairStatus } from '../features/repairs/repairsApi';

const FLOW: RepairStatus[] = ['PENDING', 'CONFIRMED', 'DIAGNOSING', 'IN_REPAIR', 'QUALITY_CHECK', 'READY_FOR_PICKUP', 'COMPLETED'];

function dateTime(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function errorMessage(error: unknown) {
  if (error && typeof error === 'object' && 'status' in error && error.status === 404) return 'No repair was found with that ticket number.';
  return 'Tracking is temporarily unavailable. Please try again.';
}

export const RepairTrackingPage = () => {
  const [ticketId, setTicketId] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [trackRepair, { data: repair, isFetching }] = useLazyTrackRepairQuery();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const normalized = ticketId.trim().toUpperCase();
    if (!normalized) return;
    setMessage(null);
    try { await trackRepair(normalized, false).unwrap(); }
    catch (error) { setMessage(errorMessage(error)); }
  };

  const currentIndex = repair ? FLOW.indexOf(repair.status) : -1;

  return <div className="min-h-screen border-b border-white/5 bg-[#080808] py-12 text-white">
    <div className="mx-auto max-w-4xl space-y-8 px-4 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-2xl space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
          <Clock3 size={14} /> Repair tracking
        </div>
        <h1 className="text-3xl font-light tracking-tight sm:text-4xl">Track your <span className="font-serif italic text-[#D4AF37]">repair</span></h1>
        <p className="text-sm font-light text-neutral-400">Enter the ticket number shown after submitting your repair request.</p>
        <form onSubmit={submit} className="relative mx-auto flex max-w-md items-center pt-2">
          <Search className="absolute left-3.5 top-[calc(50%+4px)] -translate-y-1/2 text-neutral-500" size={16} />
          <input aria-label="Repair ticket number" value={ticketId} onChange={(event) => setTicketId(event.target.value.toUpperCase())} placeholder="Ticket ID (e.g. TD-123456)" className="w-full rounded-sm border border-white/15 bg-[#111] py-3 pl-10 pr-24 font-mono text-xs text-white outline-none placeholder:text-neutral-600 focus:border-[#D4AF37]" />
          <button disabled={isFetching} className="absolute bottom-1.5 right-1.5 top-3.5 rounded-xs bg-[#D4AF37] px-4 text-xs font-semibold uppercase tracking-wider text-black disabled:opacity-60">{isFetching ? 'Loading' : 'Track'}</button>
        </form>
      </header>

      {message && <div role="alert" className="flex items-center justify-center gap-2 rounded-sm border border-amber-500/30 bg-amber-500/10 p-5 text-sm text-amber-200"><AlertCircle size={18} />{message}</div>}

      {repair && !message && <div className="space-y-6">
        <section className="rounded-sm border border-white/10 bg-[#111] p-6 shadow-2xl sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
            <div><p className="font-mono text-lg font-bold text-[#D4AF37]">{repair.ticketId}</p><h2 className="mt-1 text-2xl font-light">{repair.brand} {repair.model}</h2><p className="mt-1 text-xs text-neutral-400">Submitted by {repair.customerName} on {dateTime(repair.createdAt)}</p></div>
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${repair.status === 'CANCELLED' ? 'border-red-500/30 bg-red-500/10 text-red-300' : repair.status === 'COMPLETED' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]'}`}>{REPAIR_STATUS_LABELS[repair.status]}</span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-sm border border-white/5 bg-[#161616] p-4"><Wrench size={16} className="mb-2 text-[#D4AF37]" /><p className="text-[10px] uppercase text-neutral-500">Service</p><p className="mt-1 text-sm">{repair.service}</p></div>
            <div className="rounded-sm border border-white/5 bg-[#161616] p-4"><MapPin size={16} className="mb-2 text-[#D4AF37]" /><p className="text-[10px] uppercase text-neutral-500">Branch</p><p className="mt-1 text-sm">{repair.branch?.name ?? 'To be assigned'}</p></div>
            <div className="rounded-sm border border-white/5 bg-[#161616] p-4"><Clock3 size={16} className="mb-2 text-[#D4AF37]" /><p className="text-[10px] uppercase text-neutral-500">Estimated completion</p><p className="mt-1 text-sm">{repair.estimatedCompletion ? dateTime(repair.estimatedCompletion) : 'Not set yet'}</p></div>
          </div>
          {repair.statusNote && <p className="mt-5 rounded-sm border border-white/5 bg-white/[0.03] p-4 text-sm text-neutral-300">{repair.statusNote}</p>}
        </section>

        <section className="rounded-sm border border-white/10 bg-[#111] p-6 sm:p-8">
          <h3 className="mb-6 text-sm font-semibold uppercase tracking-widest text-[#D4AF37]">Repair progress</h3>
          {repair.status === 'CANCELLED' ? <div className="flex items-center gap-3 text-red-300"><AlertCircle size={20} /><span>This repair request was cancelled.</span></div> : <div className="space-y-5">
            {FLOW.map((status, index) => {
              const done = index <= currentIndex;
              const active = index === currentIndex;
              return <div key={status} className="flex gap-3">
                <span className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border ${done ? 'border-[#D4AF37] bg-[#D4AF37] text-black' : 'border-white/15 bg-[#181818] text-neutral-600'}`}>{done ? <CheckCircle2 size={14} /> : <span className="text-[10px]">{index + 1}</span>}</span>
                <div><p className={`text-sm ${active ? 'font-semibold text-[#D4AF37]' : done ? 'text-white' : 'text-neutral-500'}`}>{REPAIR_STATUS_LABELS[status]}</p>{active && <p className="mt-1 text-xs text-neutral-400">Current repair status</p>}</div>
              </div>;
            })}
          </div>}
        </section>

        {repair.history.length > 0 && <section className="rounded-sm border border-white/10 bg-[#111] p-6 sm:p-8">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#D4AF37]">Status updates</h3>
          <div className="divide-y divide-white/5">{[...repair.history].reverse().map((entry) => <div key={entry.id} className="flex gap-3 py-4 first:pt-0 last:pb-0"><Smartphone size={16} className="mt-0.5 shrink-0 text-neutral-500" /><div><p className="text-sm font-medium">{REPAIR_STATUS_LABELS[entry.status]}</p><p className="text-xs text-neutral-500">{dateTime(entry.createdAt)}</p>{entry.note && <p className="mt-1 text-sm text-neutral-300">{entry.note}</p>}</div></div>)}</div>
        </section>}
      </div>}
    </div>
  </div>;
};
