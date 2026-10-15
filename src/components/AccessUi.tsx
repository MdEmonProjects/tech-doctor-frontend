import { useState, type ReactNode } from 'react';
import CatalogDialog from './CatalogDialog';
import { catalogError } from './RepairServiceDialog';

export const accessInput = 'mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-clay focus:ring-2 focus:ring-clay/15 disabled:bg-slate-100';
export const accessButton = 'inline-flex items-center justify-center gap-2 rounded-lg bg-clay px-4 py-2.5 text-sm font-semibold text-white hover:bg-clay-dark disabled:opacity-60';
export const accessSecondary = 'rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-slate-50 disabled:opacity-50';

export function AccessPage({ title, description, action, children }: { title: string; description: string; action?: ReactNode; children: ReactNode }) {
  return <div className="mx-auto w-full max-w-[1400px] px-3 py-4 text-slate-900 sm:px-5 sm:py-6 lg:px-8"><section className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-5 sm:px-6"><div><h1 className="text-xl font-semibold text-foreground">{title}</h1><p className="mt-1 max-w-2xl text-sm text-muted">{description}</p></div>{action}</header>
    <div className="space-y-4 p-5 sm:p-6">{children}</div>
  </section></div>;
}

export function ConfirmAction({ title, children, confirmLabel, onConfirm, onClose }: { title: string; children: ReactNode; confirmLabel: string; onConfirm: () => Promise<unknown>; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const confirm = async () => {
    if (busy) return;
    setBusy(true); setError(null);
    try { await onConfirm(); onClose(); } catch (failure) { setError(catalogError(failure)); } finally { setBusy(false); }
  };
  return <CatalogDialog title={title} onClose={() => !busy && onClose()}>
    <div className="text-sm text-slate-600">{children}</div>
    {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
    <div className="mt-6 flex justify-end gap-3"><button type="button" disabled={busy} onClick={onClose} className={accessSecondary}>Cancel</button><button type="button" disabled={busy} onClick={confirm} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{busy ? 'Saving…' : confirmLabel}</button></div>
  </CatalogDialog>;
}

export function QueryFeedback({ loading, failed, retry, empty }: { loading: boolean; failed: boolean; retry: () => void; empty?: string }) {
  if (loading) return <p role="status" className="py-8 text-center text-sm text-muted">Loading…</p>;
  if (failed) return <p role="alert" className="py-8 text-center text-sm text-red-600">Could not load this list. <button type="button" onClick={retry} className="font-semibold underline">Try again</button></p>;
  return empty ? <p className="py-8 text-center text-sm text-muted">{empty}</p> : null;
}
