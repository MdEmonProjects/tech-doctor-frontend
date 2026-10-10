import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import DefaultInput from './DefaultInput';
import DefaultSelect from './DefaultSelect';
import { closeModal } from '../features/modal/modalSlice';
import { useCreateDeviceCatalogMutation, type CreateDeviceCatalogInput } from '../features/repairCatalog/repairCatalogApi';
import type { AppDispatch } from '../app/store';

const deviceTypes = [
  { value: 'Phone', label: 'Phone' },
  { value: 'Tablet', label: 'Tablet' },
  { value: 'Laptop', label: 'Laptop' },
  { value: 'Wearable', label: 'Wearable' },
  { value: 'Other', label: 'Other' },
];

export default function AddRepairDevice() {
  const form = useForm<CreateDeviceCatalogInput>({ defaultValues: { deviceType: 'Phone' } });
  const dispatch = useDispatch<AppDispatch>();
  const [createEntry, { isLoading, error }] = useCreateDeviceCatalogMutation();
  const apiError = error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data
    ? String(error.data.message) : null;

  const submit = async (values: CreateDeviceCatalogInput) => {
    await createEntry({ ...values, price: values.price === undefined || values.price === null || values.price === 0 ? 0 : Number(values.price) }).unwrap();
    dispatch(closeModal());
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
          Adding an existing brand, model, or repair issue updates it and links the repair issue to that model.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DefaultInput label="Brand name" registerKey="brandName" placeholder="e.g. Apple" require />
          <DefaultInput label="Model name" registerKey="modelName" placeholder="e.g. iPhone 15 Pro" require />
          <DefaultSelect label="Device type" registerKey="deviceType" options={deviceTypes} require />
          <DefaultInput label="Repair issue / service" registerKey="serviceName" placeholder="e.g. Screen replacement" require />
          <DefaultInput label="Estimated time" registerKey="estimatedTime" placeholder="e.g. 45–60 minutes" />
          <DefaultInput label="Warranty" registerKey="warranty" placeholder="e.g. 90 days" />
          <DefaultInput label="Starting price" registerKey="price" type="number" min="0" step="0.01" placeholder="0.00" />
        </div>
        <DefaultInput label="Service notes" registerKey="description" placeholder="Optional details shown to the repair team" />
        {apiError && <p className="text-sm text-red-600">{apiError}</p>}
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button type="button" onClick={() => dispatch(closeModal())} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
          <button type="submit" disabled={isLoading} className="rounded-lg bg-clay px-4 py-2 text-sm font-semibold text-white hover:bg-clay-dark disabled:opacity-60">
            {isLoading ? 'Saving…' : 'Save device service'}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
