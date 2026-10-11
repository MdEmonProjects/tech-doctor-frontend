import { useState } from 'react';
import CatalogDialog from './CatalogDialog';
import { useCreateRepairServiceMutation, useUpdateRepairServiceMutation, type RepairServiceOption } from '../features/repairCatalog/repairCatalogApi';

export function catalogError(error: unknown): string {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = error.data;
    if (data && typeof data === 'object' && 'message' in data) {
      const message = data.message;
      return Array.isArray(message) ? message.join(' ') : String(message);
    }
  }
  return 'Could not save the change. Please try again.';
}

export default function RepairServiceDialog({ service, onClose, onSaved }: { service?: RepairServiceOption; onClose: () => void; onSaved?: (service: RepairServiceOption) => void }) {
  const [name, setName] = useState(service?.name ?? '');
  const [description, setDescription] = useState(service?.description ?? '');
  const [estimatedTime, setEstimatedTime] = useState(service?.estimatedTime ?? '');
  const [warranty, setWarranty] = useState(service?.warranty ?? '');
  const [error, setError] = useState<string | null>(null);
  const [createService, { isLoading: creating }] = useCreateRepairServiceMutation();
  const [updateService, { isLoading: updating }] = useUpdateRepairServiceMutation();
  const saving = creating || updating;
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const body = { name: name.trim(), description: description.trim(), estimatedTime: estimatedTime.trim(), warranty: warranty.trim() };
    if (!body.name) { setError('Enter a service name.'); return; }
    try {
      setError(null);
      const saved = service
        ? await updateService({ serviceId: service.id, ...body }).unwrap()
        : await createService(body).unwrap();
      onSaved?.(saved);
      onClose();
    } catch (failure) { setError(catalogError(failure)); }
  };
  const fieldClass = 'mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-clay focus:ring-2 focus:ring-clay/15';
  return <CatalogDialog title={service ? 'Edit repair service' : 'Add repair service'} onClose={onClose}>
    <form onSubmit={submit} className="space-y-4">
      {service && <p className="text-sm text-muted">Changes apply to every model using this service.</p>}
      <label className="block text-sm font-semibold text-slate-700">Service name *<input value={name} onChange={(event) => setName(event.target.value)} maxLength={160} required className={fieldClass} placeholder="e.g. Screen replacement" /></label>
      <label className="block text-sm font-semibold text-slate-700">Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={5000} rows={3} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal outline-none focus:border-clay" placeholder="What is included in this repair?" /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700">Estimated time<input value={estimatedTime} onChange={(event) => setEstimatedTime(event.target.value)} maxLength={100} className={fieldClass} placeholder="e.g. 60 minutes" /></label>
        <label className="block text-sm font-semibold text-slate-700">Warranty<input value={warranty} onChange={(event) => setWarranty(event.target.value)} maxLength={100} className={fieldClass} placeholder="e.g. 90 days" /></label>
      </div>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4"><button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button><button type="submit" disabled={saving} className="rounded-lg bg-clay px-4 py-2 text-sm font-semibold text-white hover:bg-clay-dark disabled:opacity-60">{saving ? 'Saving…' : service ? 'Save changes' : 'Add service'}</button></div>
    </form>
  </CatalogDialog>;
}
