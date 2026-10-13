import { useEffect, useState, type ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CalendarClock, Clock3, FilePenLine, History, Image as ImageIcon, Mail, MapPin, Pencil, Phone, RefreshCw, Smartphone, UserRound, Wrench } from 'lucide-react';
import type { RootState } from '../../app/store';
import { AccessPage, QueryFeedback, accessButton, accessSecondary } from '../../components/AccessUi';
import RepairEditDialog from '../../components/RepairEditDialog';
import RepairStatusDialog, { REPAIR_STATUS_THEME, RepairStatusBadge } from '../../components/RepairStatusDialog';
import { hasPermission } from '../../features/auth/permissions';
import { REPAIR_STATUS_LABELS, repairImageUrl, useGetRepairQuery, type RepairHistory } from '../../features/repairs/repairsApi';

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function InfoItem({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return <div className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/75 p-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">{icon}</span><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p><div className="mt-1 break-words text-sm font-semibold text-slate-700">{children}</div></div></div>;
}

function ProtectedRepairImage({ repairId, name, index }: { repairId: number; name: string; index: number }) {
  const [source, setSource] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    let objectUrl: string | null = null;
    const load = async () => {
      try {
        const token = window.localStorage.getItem('access_token');
        const response = await fetch(repairImageUrl(repairId, name), { headers: token ? { authorization: `Bearer ${token}` } : {}, signal: controller.signal });
        if (!response.ok) throw new Error('Image could not be loaded.');
        objectUrl = URL.createObjectURL(await response.blob());
        setSource(objectUrl);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) setFailed(true);
      }
    };
    void load();
    return () => { controller.abort(); if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [name, repairId]);
  if (failed) return <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400">Photo unavailable</div>;
  return <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">{source ? <img src={source} alt={`Device damage ${index + 1}`} className="aspect-[4/3] h-full w-full object-cover transition duration-300 hover:scale-[1.02]" /> : <div className="flex aspect-[4/3] animate-pulse items-center justify-center text-slate-300"><ImageIcon size={24} /></div>}</div>;
}

function historyTitle(entry: RepairHistory) {
  return entry.eventType === 'DETAILS_UPDATED' ? 'Repair details updated' : REPAIR_STATUS_LABELS[entry.status];
}

export default function RepairDetails() {
  const actor = useSelector((state: RootState) => state.auth.user);
  const { repairId: repairIdParam } = useParams();
  const repairId = Number(repairIdParam);
  const validId = Number.isInteger(repairId) && repairId > 0;
  const { data: repair, isLoading, isError, refetch } = useGetRepairQuery(repairId, { skip: !validId });
  const [searchParams, setSearchParams] = useSearchParams();
  const panel = searchParams.get('panel');
  const closePanel = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('panel');
    setSearchParams(next, { replace: true });
  };

  if (!validId) return <AccessPage title="Repair not found" description="The repair number in this URL is invalid."><Link to="/dashboard/repair-service/repair-tracking" className={accessSecondary}>Back to repairs</Link></AccessPage>;

  return <AccessPage
    title={repair ? repair.ticketId : 'Repair details'}
    description={repair ? `${repair.customerName} · ${repair.brand} ${repair.model}` : 'Loading the complete repair record.'}
    action={<div className="flex flex-wrap gap-2"><Link to="/dashboard/repair-service/repair-tracking" className={`inline-flex items-center gap-2 ${accessSecondary}`}><ArrowLeft size={16} />All repairs</Link>{repair && hasPermission(actor, 'repairs.update') && <button type="button" onClick={() => setSearchParams({ panel: 'edit' })} className={accessSecondary}><span className="inline-flex items-center gap-2"><Pencil size={15} />Edit</span></button>}{repair && hasPermission(actor, 'repairs.status') && <button type="button" onClick={() => setSearchParams({ panel: 'status' })} className={accessButton}><RefreshCw size={15} />Update status</button>}</div>}
  >
    <QueryFeedback loading={isLoading} failed={isError} retry={() => void refetch()} />

    {repair && <>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-[linear-gradient(135deg,#fff_0%,#fffaf7_52%,#f4faf7_100%)] shadow-[0_12px_40px_-30px_rgba(15,23,42,.5)]">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">Repair order</p><div className="mt-2 flex flex-wrap items-center gap-3"><h2 className="font-mono text-2xl font-bold text-slate-900">{repair.ticketId}</h2><RepairStatusBadge status={repair.status} /></div><p className="mt-2 text-sm text-slate-500">Created {formatDate(repair.createdAt)} · Last updated {formatDate(repair.updatedAt)}</p></div>
          {repair.estimatedCompletion && <div className="rounded-xl border border-emerald-200 bg-white/80 px-4 py-3 shadow-sm"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600"><CalendarClock size={15} />Estimated completion</p><p className="mt-1 text-sm font-semibold text-emerald-900">{formatDate(repair.estimatedCompletion)}</p></div>}
        </div>
        {repair.statusNote && <div className="border-t border-slate-200/70 bg-white/65 px-5 py-4 text-sm text-slate-600 sm:px-6"><span className="mr-2 font-semibold text-clay">Latest customer update</span>{repair.statusNote}</div>}
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,.75fr)]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center gap-2"><UserRound size={18} className="text-clay" /><h2 className="font-semibold text-slate-900">Customer and device</h2></div><div className="grid gap-3 sm:grid-cols-2">
            <InfoItem icon={<UserRound size={17} />} label="Customer">{repair.customerName}</InfoItem>
            <InfoItem icon={<Phone size={17} />} label="Phone"><a href={`tel:${repair.phone}`} className="hover:text-clay">{repair.phone ?? 'Not provided'}</a></InfoItem>
            <InfoItem icon={<Mail size={17} />} label="Email">{repair.email ? <a href={`mailto:${repair.email}`} className="hover:text-clay">{repair.email}</a> : 'Not provided'}</InfoItem>
            <InfoItem icon={<Smartphone size={17} />} label="Device">{repair.brand} {repair.model}</InfoItem>
          </div></section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center gap-2"><Wrench size={18} className="text-clay" /><h2 className="font-semibold text-slate-900">Repair request</h2></div><div className="grid gap-3 sm:grid-cols-2">
            <InfoItem icon={<Wrench size={17} />} label="Damage type">{repair.service}</InfoItem>
            <InfoItem icon={<MapPin size={17} />} label="Branch">{repair.branch?.name ?? 'Not assigned'}</InfoItem>
            <InfoItem icon={<FilePenLine size={17} />} label="Service mode">{repair.serviceMode?.replaceAll('-', ' ') ?? 'Not specified'}</InfoItem>
            <InfoItem icon={<Clock3 size={17} />} label="Preferred schedule">{[repair.preferredDate, repair.preferredTime].filter(Boolean).join(' · ') || 'Not specified'}</InfoItem>
          </div>{repair.customerNotes && <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50/60 p-4"><p className="text-xs font-bold uppercase tracking-wider text-amber-700">Customer notes</p><p className="mt-1 text-sm leading-relaxed text-slate-700">{repair.customerNotes}</p></div>}</section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between gap-3"><div className="flex items-center gap-2"><ImageIcon size={18} className="text-clay" /><h2 className="font-semibold text-slate-900">Device damage photos</h2></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">{repair.damageImages?.length ?? 0}/3</span></div>{repair.damageImages?.length ? <div className="grid gap-3 sm:grid-cols-3">{repair.damageImages.map((name, index) => <ProtectedRepairImage key={name} repairId={repair.id} name={name} index={index} />)}</div> : <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-8 text-center text-sm text-slate-500">No damage photos were submitted.</div>}</section>
        </div>

        <section className="self-start rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-5"><div className="mb-5 flex items-center gap-2"><History size={18} className="text-clay" /><div><h2 className="font-semibold text-slate-900">Update history</h2><p className="text-xs text-slate-500">Status and staff activity</p></div></div>
          <ol className="relative space-y-0">{[...repair.history].reverse().map((entry, index, entries) => {
            const isDetails = entry.eventType === 'DETAILS_UPDATED';
            const actorName = entry.updatedBy?.name ?? entry.updatedBy?.email ?? (index === entries.length - 1 ? 'Customer submission' : 'System');
            return <li key={entry.id} className="relative flex gap-3 pb-6 last:pb-0"><div className="flex w-5 shrink-0 flex-col items-center"><span className={`z-10 mt-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-white ${isDetails ? 'bg-slate-400' : REPAIR_STATUS_THEME[entry.status].dot}`} />{index < entries.length - 1 && <span className="absolute bottom-0 top-4 w-px bg-slate-200" />}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-x-2"><p className="font-semibold text-slate-800">{historyTitle(entry)}</p><time className="text-[11px] text-slate-400">{formatDate(entry.createdAt)}</time></div>{entry.note && <p className="mt-1 text-sm leading-relaxed text-slate-600">{entry.note}</p>}{entry.changes?.fields?.length ? <div className="mt-2 flex flex-wrap gap-1">{entry.changes.fields.map((field) => <span key={field} className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500">{field}</span>)}</div> : null}<p className="mt-2 text-xs text-slate-400">Updated by <span className="font-medium text-slate-600">{actorName}</span></p></div></li>;
          })}</ol>
        </section>
      </div>

      {panel === 'status' && hasPermission(actor, 'repairs.status') && <RepairStatusDialog repair={repair} onClose={closePanel} />}
      {panel === 'edit' && hasPermission(actor, 'repairs.update') && <RepairEditDialog repair={repair} onClose={closePanel} />}
    </>}
  </AccessPage>;
}
