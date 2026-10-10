import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import DefaultInput from './DefaultInput';
import { closeModal } from '../features/modal/modalSlice';
import { useCreateRepairBrandMutation } from '../features/repairCatalog/repairCatalogApi';
import type { AppDispatch } from '../app/store';

export default function AddRepairBrand() {
  const form = useForm<{ name: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [createBrand, { isLoading }] = useCreateRepairBrandMutation();
  const submit = async ({ name }: { name: string }) => {
    await createBrand({ name }).unwrap();
    dispatch(closeModal());
  };
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-5">
        <p className="text-sm leading-relaxed text-slate-600">Create the manufacturer first. You can then add as many models and repair services as required.</p>
        <DefaultInput label="Brand name" registerKey="name" placeholder="e.g. Samsung" require autoFocus />
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button type="button" onClick={() => dispatch(closeModal())} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
          <button type="submit" disabled={isLoading} className="rounded-lg bg-clay px-4 py-2 text-sm font-semibold text-white hover:bg-clay-dark disabled:opacity-60">{isLoading ? 'Saving…' : 'Add brand'}</button>
        </div>
      </form>
    </FormProvider>
  );
}
