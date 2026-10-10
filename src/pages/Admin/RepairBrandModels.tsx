import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ArrowLeft, Check, Plus, Wrench } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import DefaultInput from '../../components/DefaultInput';
import DefaultSelect from '../../components/DefaultSelect';
import { useAddModelServicesMutation, useGetRepairCatalogQuery, useGetRepairServicesQuery } from '../../features/repairCatalog/repairCatalogApi';

type ModelForm = { modelName: string; deviceType: string; newServiceName?: string; estimatedTime?: string; warranty?: string; price?: number };
const deviceTypes = [{ value: 'Phone', label: 'Phone' }, { value: 'Tablet', label: 'Tablet' }, { value: 'Laptop', label: 'Laptop' }, { value: 'Wearable', label: 'Wearable' }, { value: 'Other', label: 'Other' }];

export default function RepairBrandModels() {
  const brandId = Number(useParams().brandId);
  const { data: catalog = [], isLoading: catalogLoading } = useGetRepairCatalogQuery();
  const { data: services = [], isLoading: servicesLoading } = useGetRepairServicesQuery();
  const [saveModelServices, { isLoading: isSaving }] = useAddModelServicesMutation();
  const [selectedServiceIds, setSelectedServiceIds] = useState<Set<number>>(new Set());
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<ModelForm>({ defaultValues: { deviceType: 'Phone' } });
  const brand = catalog.find((entry) => entry.id === brandId);

  const toggleService = (serviceId: number) => setSelectedServiceIds((current) => {
    const next = new Set(current);
    next.has(serviceId) ? next.delete(serviceId) : next.add(serviceId);
    return next;
  });

  const submit = async (values: ModelForm) => {
    if (!selectedServiceIds.size && !values.newServiceName?.trim()) {
      setFormError('Select at least one service or add a new service.');
      return;
    }
    setFormError(null);
    await saveModelServices({
      brandId,
      modelName: values.modelName,
      deviceType: values.deviceType,
      serviceIds: [...selectedServiceIds],
      newServiceName: values.newServiceName?.trim() || undefined,
      estimatedTime: values.estimatedTime?.trim() || undefined,
      warranty: values.warranty?.trim() || undefined,
      price: values.price === undefined || values.price === null || values.price === 0 ? 0 : Number(values.price),
    }).unwrap();
    form.reset({ deviceType: 'Phone' });
    setSelectedServiceIds(new Set());
  };

  if (catalogLoading) return <p className="p-8 text-center text-sm text-muted">Loading brand…</p>;
  if (!brand) return <div className="p-8 text-center"><p className="font-medium text-foreground">Brand not found.</p><Link to="/dashboard/repair-service/brands-services" className="mt-3 inline-block text-sm font-semibold text-clay">Back to brands</Link></div>;

  return (
    <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
      <Link to="/dashboard/repair-service/brands-services" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-clay"><ArrowLeft size={16} />All brands</Link>
      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="rounded-xl border border-border bg-surface p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-full bg-brand-icon-bg text-clay"><Wrench size={20} /></span><div><p className="text-sm text-muted">Manage models and repairs</p><h1 className="text-2xl font-semibold text-foreground">{brand.name}</h1></div></div>
          <div className="space-y-4">
            {brand.models.length === 0 && <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted">No models added yet.</p>}
            {brand.models.map((model) => <article key={model.id} className="rounded-lg border border-border p-4"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-semibold text-foreground">{model.name}</h2><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{model.deviceType}</span></div><div className="mt-3 flex flex-wrap gap-2">{model.services.map((entry) => <span key={entry.id} className="rounded-md bg-clay/10 px-2.5 py-1 text-xs font-medium text-clay">{entry.service.name}{entry.price !== null && ` · $${Number(entry.price).toFixed(2)}`}</span>)}</div></article>)}
          </div>
        </section>

        <aside className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <div className="mb-5"><p className="text-sm font-semibold text-clay">Add model</p><h2 className="text-lg font-semibold text-foreground">Services for a {brand.name} model</h2><p className="mt-1 text-sm text-muted">Select every repair service you provide for this model.</p></div>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
              <DefaultInput label="Model name" registerKey="modelName" placeholder="e.g. Galaxy S24 Ultra" require />
              <DefaultSelect label="Device type" registerKey="deviceType" options={deviceTypes} require />
              <fieldset><legend className="mb-2 text-sm font-semibold text-slate-700">Available services</legend><div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-3">{servicesLoading ? <p className="text-sm text-muted">Loading services…</p> : services.map((service) => <label key={service.id} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={selectedServiceIds.has(service.id)} onChange={() => toggleService(service.id)} className="size-4 rounded border-slate-300 text-clay focus:ring-clay" />{service.name}</label>)}</div></fieldset>
              <div className="border-t border-dashed border-slate-200 pt-4"><p className="mb-3 text-sm font-semibold text-slate-700">New service not listed? Add it here.</p><div className="space-y-3"><DefaultInput label="New service name" registerKey="newServiceName" placeholder="e.g. Back glass replacement" /><DefaultInput label="Estimated time" registerKey="estimatedTime" placeholder="e.g. 60–90 minutes" /><DefaultInput label="Warranty" registerKey="warranty" placeholder="e.g. 90 days" /></div></div>
              <DefaultInput label="Starting price for selected services" registerKey="price" type="number" min="0" step="0.01" placeholder="0.00" />
              {formError && <p className="text-sm font-medium text-red-600">{formError}</p>}
              <button type="submit" disabled={isSaving} className="flex w-full items-center justify-center gap-2 rounded-lg bg-clay px-4 py-2.5 text-sm font-semibold text-white hover:bg-clay-dark disabled:opacity-60"><Plus size={16} />{isSaving ? 'Saving…' : 'Save model & services'}</button>
            </form>
          </FormProvider>
        </aside>
      </div>
    </div>
  );
}
