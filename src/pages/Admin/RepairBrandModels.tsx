import { useEffect, useState, type FormEvent } from 'react';
import { useSelector } from 'react-redux';
import { ArrowLeft, Pencil, Plus, Trash2, Wrench } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import type { RootState } from '../../app/store';
import { hasPermission } from '../../features/auth/permissions';
import CatalogDialog from '../../components/CatalogDialog';
import RepairServiceDialog, { catalogError } from '../../components/RepairServiceDialog';
import {
  useAddModelServicesMutation,
  useDeleteRepairModelMutation,
  useDeleteRepairServiceMutation,
  useGetRepairCatalogQuery,
  useGetRepairServicesQuery,
  useUpdateRepairModelMutation,
  type CatalogBrand,
  type CatalogModel,
  type RepairServiceOption,
} from '../../features/repairCatalog/repairCatalogApi';

const deviceTypes = ['Phone', 'Tablet', 'Laptop', 'Wearable', 'Other'];
const inputClass = 'mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-clay focus:ring-2 focus:ring-clay/15';

function ModelForm({ brand, model, onSaved, onCancel }: {
  brand: CatalogBrand;
  model?: CatalogModel;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const user = useSelector((state: RootState) => state.auth.user);
  const canSaveModel = hasPermission(user, model ? 'catalog.models.update' : 'catalog.models.create');
  const canCreateService = hasPermission(user, 'catalog.services.create');
  const canUpdateService = hasPermission(user, 'catalog.services.update');
  const canDeleteService = hasPermission(user, 'catalog.services.delete');
  const [name, setName] = useState(model?.name ?? '');
  const [deviceType, setDeviceType] = useState(model?.deviceType ?? 'Phone');
  const [selected, setSelected] = useState<Record<number, string>>(() => Object.fromEntries(
    model?.services.map((entry) => [entry.service.id, entry.price === null ? '' : String(entry.price)]) ?? [],
  ));
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [recentServiceId, setRecentServiceId] = useState<number | null>(null);
  const [serviceDialog, setServiceDialog] = useState(false);
  const [editingService, setEditingService] = useState<RepairServiceOption | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RepairServiceOption | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { data: services = [], isLoading, isError, isFetching, refetch } = useGetRepairServicesQuery();
  const [createModel, { isLoading: creating }] = useAddModelServicesMutation();
  const [updateModel, { isLoading: updating }] = useUpdateRepairModelMutation();
  const [deleteService, { isLoading: deletingService }] = useDeleteRepairServiceMutation();
  const saving = creating || updating;
  const unavailableIds = !isLoading && !isError
    ? Object.keys(selected).map(Number).filter((id) => !services.some((service) => service.id === id))
    : [];

  useEffect(() => {
    if (recentServiceId !== null && !serviceDialog && services.some((service) => service.id === recentServiceId)) {
      document.getElementById(`service-option-${recentServiceId}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [recentServiceId, serviceDialog, services]);

  const toggle = (id: number) => setSelected((current) => {
    const next = { ...current };
    if (Object.hasOwn(next, id)) delete next[id]; else next[id] = '';
    return next;
  });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (saving || !canSaveModel) return;
    if (!name.trim()) { setError('Enter a model name.'); return; }
    const entries = Object.entries(selected);
    for (const [, price] of entries) {
      if (price !== '' && (!/^\d+(\.\d{1,2})?$/.test(price) || Number(price) > 99999999.99)) {
        setError('Enter a valid price with at most two decimal places.');
        return;
      }
    }
    const body = {
      name: name.trim(),
      deviceType,
      services: entries.map(([serviceId, price]) => ({
        serviceId: Number(serviceId),
        ...(price === '' ? {} : { price: Number(price) }),
      })),
    };
    try {
      setError(null);
      if (model) await updateModel({ modelId: model.id, ...body }).unwrap();
      else await createModel({ brandId: brand.id, ...body }).unwrap();
      setName('');
      setDeviceType('Phone');
      setSelected({});
      setRecentServiceId(null);
      setNotice('Model saved successfully.');
      onSaved();
    } catch (failure) { setError(catalogError(failure)); }
  };

  const confirmDeleteService = async () => {
    if (!deleteTarget || deletingService) return;
    try {
      setDeleteError(null);
      await deleteService(deleteTarget.id).unwrap();
      setSelected((current) => {
        const next = { ...current };
        delete next[deleteTarget.id];
        return next;
      });
      setNotice(`${deleteTarget.name} removed from all models.`);
      setDeleteTarget(null);
    } catch (failure) { setDeleteError(catalogError(failure)); }
  };

  return <>
    <div className="mb-5">
      <p className="text-sm font-semibold text-clay">{canSaveModel ? model ? 'Edit model' : 'Add model' : 'Repair services'}</p>
      <h2 className="text-lg font-semibold text-foreground">{canSaveModel ? model ? model.name : `Services for a ${brand.name} model` : 'Available services'}</h2>
      <p className="mt-1 text-sm text-muted">{canSaveModel ? 'Choose the repairs you provide and set a price for each service.' : 'Manage the shared services allowed by your role.'}</p>
    </div>
    <form onSubmit={submit} className="space-y-4">
      <fieldset disabled={saving} className="space-y-4 disabled:opacity-60">
        {canSaveModel && <><label className="block text-sm font-semibold text-slate-700">
          Model name *
          <input value={name} onChange={(event) => setName(event.target.value)} maxLength={160} required className={inputClass} placeholder="e.g. Galaxy S24 Ultra" />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Device type
          <select value={deviceType} onChange={(event) => setDeviceType(event.target.value)} className={inputClass}>
            {deviceTypes.map((type) => <option key={type}>{type}</option>)}
          </select>
        </label>
        </>}
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-700">Available services</h3>
            {canCreateService && <button type="button" onClick={() => { setEditingService(null); setServiceDialog(true); }} className="inline-flex items-center gap-1 text-sm font-semibold text-clay hover:underline">
              <Plus size={15} />New service
            </button>}
          </div>
          <p className="mb-3 text-xs text-muted">{canSaveModel ? canCreateService ? 'Missing a repair? Add it here, then select it below. Leave its price blank when a quote is needed.' : 'Select the repairs offered for this model. Ask a service manager to add any missing repairs.' : 'Service changes apply to every model using the service.'}</p>
          {notice && <p role="status" className="mb-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">{notice}</p>}
          <div className="max-h-80 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-3">
            {isLoading ? <p role="status" className="text-sm text-muted">Loading services…</p>
              : isError ? <div role="alert" className="text-sm text-red-600">Could not load services. <button type="button" onClick={() => void refetch()} className="font-semibold underline">Try again</button></div>
              : services.length ? services.map((service) => <div key={service.id} id={`service-option-${service.id}`} className={`rounded-lg p-2.5 ${recentServiceId === service.id ? 'bg-green-50 ring-1 ring-green-200' : 'bg-slate-50'}`}>
                <div className="flex items-start justify-between gap-2">
                  <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-2 text-sm text-slate-800">
                    {canSaveModel && <input type="checkbox" checked={Object.hasOwn(selected, service.id)} onChange={() => toggle(service.id)} className="mt-0.5 size-4 shrink-0 accent-clay" />}
                    <span>{service.name}</span>
                  </label>
                  <div className="flex shrink-0 gap-1">
                    {canUpdateService && <button type="button" onClick={() => { setEditingService(service); setServiceDialog(true); }} aria-label={`Edit service ${service.name}`} className="rounded p-1 text-muted hover:bg-white hover:text-clay"><Pencil size={14} /></button>}
                    {canDeleteService && <button type="button" onClick={() => { setDeleteError(null); setDeleteTarget(service); }} aria-label={`Remove service ${service.name}`} className="rounded p-1 text-muted hover:bg-red-50 hover:text-red-600"><Trash2 size={14} /></button>}
                  </div>
                </div>
                {canSaveModel && Object.hasOwn(selected, service.id) && <label className="mt-2 flex items-center justify-between gap-3 text-xs text-muted">
                  Price for this model
                  <input aria-label={`${service.name} price`} type="number" min="0" max="99999999.99" step="0.01" value={selected[service.id]} onChange={(event) => setSelected((current) => ({ ...current, [service.id]: event.target.value }))} placeholder="Quote" className="h-9 w-28 rounded-lg border border-slate-300 bg-white px-2 text-sm text-slate-900" />
                </label>}
              </div>) : <p className="text-sm text-muted">{canCreateService ? 'No services yet. Click New service to add your first repair.' : 'No services available yet.'}</p>}
            {unavailableIds.map((id) => <div key={id} className="flex items-center justify-between gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
              <span>A selected service is no longer available.</span>
              <button type="button" onClick={() => toggle(id)} className="font-semibold underline">Remove</button>
            </div>)}
          </div>
          {isFetching && !isLoading && <p role="status" className="mt-2 text-xs text-muted">Updating services…</p>}
        </div>
      </fieldset>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {canSaveModel && <div className="flex gap-2">
        {model && <button type="button" disabled={saving} onClick={onCancel} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 disabled:opacity-60">Cancel</button>}
        <button type="submit" disabled={saving || isLoading || isError || unavailableIds.length > 0} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-clay px-4 py-2.5 text-sm font-semibold text-white hover:bg-clay-dark disabled:opacity-60">
          {!model && <Plus size={16} />}{saving ? 'Saving…' : model ? 'Save changes' : 'Save model & services'}
        </button>
      </div>}
    </form>
    {serviceDialog && (editingService ? canUpdateService : canCreateService) && <RepairServiceDialog
      service={editingService ?? undefined}
      onClose={() => setServiceDialog(false)}
      onSaved={(saved) => {
        setRecentServiceId(saved.id);
        setNotice(editingService ? `${saved.name} updated.` : canSaveModel ? `${saved.name} is now available. Select it and enter its price below.` : `${saved.name} added.`);
      }}
    />}
    {canDeleteService && deleteTarget && <CatalogDialog title="Remove repair service?" onClose={() => !deletingService && setDeleteTarget(null)}>
      <p className="text-sm text-slate-600"><strong>{deleteTarget.name}</strong> will be removed from the available services and every model using it. Other model details you entered will be kept.</p>
      {deleteError && <p role="alert" className="mt-3 text-sm text-red-600">{deleteError}</p>}
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" disabled={deletingService} onClick={() => setDeleteTarget(null)} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
        <button type="button" disabled={deletingService} onClick={confirmDeleteService} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{deletingService ? 'Removing…' : 'Remove service'}</button>
      </div>
    </CatalogDialog>}
  </>;
}

function BrandWorkspace({ brand }: { brand: CatalogBrand }) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [editingModel, setEditingModel] = useState<CatalogModel | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CatalogModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteModel, { isLoading: deleting }] = useDeleteRepairModelMutation();
  const canEditModel = hasPermission(user, 'catalog.models.update');
  const canDeleteModel = hasPermission(user, 'catalog.models.delete');
  const canManage = hasPermission(user, 'catalog.models.create') || (editingModel !== null && canEditModel)
    || ['catalog.services.create', 'catalog.services.update', 'catalog.services.delete'].some((key) => hasPermission(user, key));
  useEffect(() => { if (editingModel) document.getElementById('model-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [editingModel]);
  const confirmDelete = async () => {
    if (!deleteTarget || deleting) return;
    try {
      setError(null);
      await deleteModel(deleteTarget.id).unwrap();
      if (editingModel?.id === deleteTarget.id) setEditingModel(null);
      setDeleteTarget(null);
    } catch (failure) { setError(catalogError(failure)); }
  };
  return <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
    <Link to="/dashboard/repair-service/brands-services" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-clay"><ArrowLeft size={16} />All brands</Link>
    <div className={`mt-4 grid items-start gap-6 ${canManage ? 'lg:grid-cols-[minmax(0,1fr)_380px]' : ''}`}>
      <section className="min-w-0 rounded-xl border border-border bg-surface p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-brand-icon-bg text-clay"><Wrench size={20} /></span>
          <div><p className="text-sm text-muted">Manage models and repairs</p><h1 className="text-2xl font-semibold text-foreground">{brand.name}</h1></div>
        </div>
        <div className="space-y-4">
          {brand.models.length === 0 && <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted">No models added yet.</p>}
          {brand.models.map((model) => <article key={model.id} className="rounded-lg border border-border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-semibold text-foreground">{model.name}</h2>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{model.deviceType}</span>
                {canEditModel && <button type="button" onClick={() => setEditingModel(model)} aria-label={`Edit model ${model.name}`} className="rounded-lg border border-border p-2 text-foreground hover:bg-slate-50"><Pencil size={17} /></button>}
                {canDeleteModel && <button type="button" onClick={() => { setError(null); setDeleteTarget(model); }} aria-label={`Remove model ${model.name}`} className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"><Trash2 size={17} /></button>}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {model.services.length ? model.services.map((entry) => <span key={entry.id} className="rounded-md bg-clay/10 px-2.5 py-1 text-xs font-medium text-clay">
                {entry.service.name}{entry.price !== null ? ` · $${Number(entry.price).toFixed(2)}` : ' · Quote'}
              </span>) : <span className="text-sm text-muted">No services assigned yet.</span>}
            </div>
          </article>)}
        </div>
      </section>
      {canManage && <aside id="model-form" className="min-w-0 scroll-mt-4 rounded-xl border border-border bg-surface p-5 shadow-sm">
        <ModelForm key={editingModel?.id ?? 'new'} brand={brand} model={editingModel ?? undefined} onSaved={() => setEditingModel(null)} onCancel={() => setEditingModel(null)} />
      </aside>}
    </div>
    {canDeleteModel && deleteTarget && <CatalogDialog title="Remove model?" onClose={() => !deleting && setDeleteTarget(null)}>
      <p className="text-sm text-slate-600"><strong>{deleteTarget.name}</strong> and its repair options will disappear from the active catalog.</p>
      {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" disabled={deleting} onClick={() => setDeleteTarget(null)} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
        <button type="button" disabled={deleting} onClick={confirmDelete} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{deleting ? 'Removing…' : 'Remove model'}</button>
      </div>
    </CatalogDialog>}
  </div>;
}

export default function RepairBrandModels() {
  const brandId = Number(useParams().brandId);
  const { data: catalog = [], isLoading, isError } = useGetRepairCatalogQuery();
  const brand = catalog.find((entry) => entry.id === brandId);
  if (isLoading) return <p className="p-8 text-center text-sm text-muted">Loading brand…</p>;
  if (isError) return <p role="alert" className="p-8 text-center text-sm text-red-600">Could not load this brand.</p>;
  if (!brand) return <div className="p-8 text-center"><p className="font-medium text-foreground">Brand not found.</p><Link to="/dashboard/repair-service/brands-services" className="mt-3 inline-block text-sm font-semibold text-clay">Back to brands</Link></div>;
  return <BrandWorkspace key={brandId} brand={brand} />;
}
